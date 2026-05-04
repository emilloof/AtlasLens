// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const SECRET_KEY = process.env.SECRET_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const savedState = req.cookies.get("oauth_state")?.value;

  if (!code || !returnedState || !savedState || returnedState !== savedState) {
    return NextResponse.redirect("/login?error=oauth_state_mismatch");
  }

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect("/login?error=token_exchange_failed");
  }

  const tokenJson = await tokenRes.json();
  const { access_token, refresh_token, expires_in, id_token } = tokenJson as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    id_token?: string;
  };

  const userinfoRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userinfoRes.ok) {
    return NextResponse.redirect("/login?error=userinfo_failed");
  }

  const profile = (await userinfoRes.json()) as {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  };

  const provider = "google";
  const providerAccountId = profile.sub;

  let user = await prisma.user.findUnique({ where: { email: profile.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        username: profile.name || profile.email.split("@")[0],
        profile_image: profile.picture,

        oauthAccounts: {
          create: {
            provider,
            provider_account_id: providerAccountId,
            access_token,
            refresh_token,
            expires_at: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
          },
        },
      },
    });
  } else {
    const existing = await prisma.oAuthAccount.findUnique({
      where: {
        provider_provider_account_id: {
          provider,
          provider_account_id: providerAccountId,
        },
      },
    });

    if (!existing) {
      await prisma.oAuthAccount.create({
        data: {
          provider,
          provider_account_id: providerAccountId,
          user_id: user.user_id,
          access_token,
          refresh_token,
          expires_at: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
        },
      });
    } else {
      await prisma.oAuthAccount.update({
        where: { id: existing.id },
        data: {
          access_token,
          refresh_token,
          expires_at: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
        },
      });
    }
  }

  const token = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: "6h" });

  const redirectUrl = new URL("/map", req.url);
  const res = NextResponse.redirect(redirectUrl);

  res.cookies.set("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,  // 1시간
  });

  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
  return res;
}
