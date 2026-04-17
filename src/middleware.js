// Intentionally disabled. Each protected page checks auth itself.
import { NextResponse } from "next/server";
export function middleware() { return NextResponse.next(); }
export const config = { matcher: [] };
