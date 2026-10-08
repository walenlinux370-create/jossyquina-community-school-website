import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;
  const protectedPath =
    pathname.startsWith("/admin") || pathname.startsWith("/professor");

  if (protectedPath) {
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
      const url = new URL("/auth", request.url);
      url.searchParams.set("next", pathname);

      const redirectResponse = NextResponse.redirect(url);

      // Preserve any refreshed Supabase auth cookies.
      redirectResponse.cookies.setAll(supabaseResponse.cookies.getAll());

      return redirectResponse;
    }
  }

  if (
    pathname.startsWith("/portal") &&
    pathname !== "/portal/login" &&
    !request.cookies.get("student_session")
  ) {
    const redirectResponse = NextResponse.redirect(
      new URL("/portal/login", request.url),
    );

    // Preserve any refreshed Supabase auth cookies.
    redirectResponse.cookies.setAll(supabaseResponse.cookies.getAll());

    return redirectResponse;
  }

  supabaseResponse.headers.set(
    "X-Robots-Tag",
    protectedPath || pathname.startsWith("/portal") || pathname.startsWith("/api")
      ? "noindex, nofollow"
      : "index, follow",
  );
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );
  supabaseResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  supabaseResponse.headers.set("X-Frame-Options", "DENY");

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
