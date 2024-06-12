import React from "react";
import WidthWrapper from "./WidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  SignInButton,
  SignUp,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <nav className="sticky h-14  inset-x-0 top-0 z-30 w-full border-b light:border-gray-200 bg-white/80 dark:bg-black/80 blurry backdrop-blur  dark:border-blacks">
      <WidthWrapper>
        <div className=" flex h-14 items-center justify-between border-b border-zinc-200 dark:border-none">
          <Link href="/" className="flex z-40 font-semibold text-xl">
            Gossipy
          </Link>
          {/* {MOBILE NAVBAR} */}
          <div className=" hidden items-center space-x-4 sm:flex">
            <>
              <ModeToggle />
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "lg",
                })}
              >
                Pricing
              </Link>
              <SignedOut>
                <SignInButton>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </Link>
                </SignInButton>
              </SignedOut>
              <SignedOut>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ size: "sm", className: `px-6` })}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          </div>
        </div>
      </WidthWrapper>
    </nav>
  );
};

export default Navbar;
