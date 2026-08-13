"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/auth/avatar";

interface ProfilePhotoProps {
  primerNombre: string;
  apellido: string;
}

export function ProfilePhoto({ primerNombre, apellido }: ProfilePhotoProps) {
  const getUserInitials = () => {
    const f = (primerNombre || "").charAt(0).toUpperCase();
    const l = (apellido || "").charAt(0).toUpperCase();
    return (f + (l || f)).substring(0, 2);
  };

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <Avatar size="2xl" variant="solid" shape="circle">
          <AvatarFallback className="text-3xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>

      <h4 className="text-lg! md:text-xl! lg:text-2xl! font-semibold! text-neutral-900 mt-4 truncate">
        {primerNombre} {apellido}
      </h4>
    </div>
  );
}
