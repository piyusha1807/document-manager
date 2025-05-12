"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import {
  LayoutDashboard,
  UserCog,
  LogOut,
  MessageCircle,
  Bot,
  File,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

export function SidePanel() {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "User Management",
      href: "/user-management",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Document Management",
      href: "/document-management",
      icon: (
        <File className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ingestion Management",
      href: "/ingestion-management",
      icon: (
        <Bot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Q&A",
      href: "/q&a",
      icon: (
        <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleLogout,
    },
  ];

  // Function to check if a link is active
  const isLinkActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => {
              if (link.onClick) {
                return (
                  <div
                    key={idx}
                    className="cursor-pointer"
                    onClick={link.onClick}
                  >
                    <SidebarLink
                      link={link}
                      isActive={isLinkActive(link.href)}
                    />
                  </div>
                );
              }

              return (
                <SidebarLink
                  key={idx}
                  link={link}
                  isActive={isLinkActive(link.href)}
                />
              );
            })}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: state.user?.name || "User",
              href: "#",
              icon: (
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    {state.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ),
            }}
            isActive={false}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Document Manager
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
