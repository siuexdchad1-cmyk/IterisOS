import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wzotdcfvvvssnfnsxppg.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();

    // If authenticated user visits auth pages -> redirect to dashboard
    if (user && (url.pathname === "/login" || url.pathname === "/signup")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.warn("Middleware auth check warning:", err);
  }

  return response;
}

export const config = {
  matcher: ["/login", "/signup"],
};
