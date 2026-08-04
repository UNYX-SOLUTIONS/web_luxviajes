/* eslint-disable @next/next/no-img-element */
// components/ui/avatar.tsx
import * as React from "react"
import { UserIcon } from "@heroicons/react/24/outline"
import { cn } from "@/utils/cn"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  shape?: "circle" | "square" | "rounded"
  variant?: "solid" | "outline" | "ghost"
  status?: "online" | "offline" | "busy" | "away" | "none"
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (loaded: boolean) => void
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  delayMs?: number
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  spacing?: "sm" | "md" | "lg"
  size?: AvatarProps["size"]
}

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    size = "md", 
    shape = "circle", 
    variant = "solid",
    status = "none",
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
      "2xl": "h-20 w-20 text-2xl",
    }

    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-none",
      rounded: "rounded-xl",
    }

    const variantClasses = {
      solid: "bg-primary-100 text-primary-700",
      outline: "bg-transparent border-2 border-primary-300 text-primary-600",
      ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
    }

    const statusColors = {
      online: "bg-green-500",
      offline: "bg-neutral-400",
      busy: "bg-red-500",
      away: "bg-yellow-500",
      none: "",
    }

    const statusSizes = {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-3.5 w-3.5",
      "2xl": "h-4 w-4",
    }

    return (
      <div className="relative inline-block">
        <div
          ref={ref}
          className={cn(
            "relative flex shrink-0 overflow-hidden",
            sizeClasses[size],
            shapeClasses[shape],
            variantClasses[variant],
            "transition-all duration-200",
            "ring-1 ring-neutral-200/50",
            className
          )}
          {...props}
        >
          {children}
        </div>
        {status !== "none" && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
              statusColors[status],
              statusSizes[size]
            )} 
          />
        )}
      </div>
    )
  }
)
AvatarRoot.displayName = "Avatar"

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading")

    React.useEffect(() => {
      if (!src) {
        setStatus("error")
        return
      }

      const image = new window.Image()
      image.src = typeof src === "string" ? src : URL.createObjectURL(src)
      image.onload = () => {
        setStatus("loaded")
        onLoadingStatusChange?.(true)
      }
      image.onerror = () => {
        setStatus("error")
        onLoadingStatusChange?.(false)
      }
    }, [src, onLoadingStatusChange])

    if (status !== "loaded") return null

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs, children, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(delayMs === undefined)

    React.useEffect(() => {
      if (delayMs === undefined) return

      const timerId = setTimeout(() => {
        setCanRender(true)
      }, delayMs)

      return () => clearTimeout(timerId)
    }, [delayMs])

    return canRender ? (
      <span
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center font-medium",
          className
        )}
        {...props}
      >
        {children || <UserIcon className="h-2/3 w-2/3" />}
      </span>
    ) : null
  }
)
AvatarFallback.displayName = "AvatarFallback"

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    children, 
    max = 3, 
    spacing = "md", 
    size = "md",
    className,
    ...props 
  }, ref) => {
    const spacingClasses = {
      sm: "-space-x-1",
      md: "-space-x-2",
      lg: "-space-x-3",
    }

    const avatars = React.Children.toArray(children)
    const visibleAvatars = max ? avatars.slice(0, max) : avatars
    const excess = max ? avatars.length - max : 0

    const sizeClasses = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
      "2xl": "h-20 w-20 text-2xl",
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center", spacingClasses[spacing], className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <div 
            key={index} 
            className="ring-2 ring-white rounded-full overflow-hidden transition-transform hover:scale-110 hover:z-10"
          >
            {avatar}
          </div>
        ))}
        {excess > 0 && (
          <div 
            className={cn(
              "relative flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium ring-2 ring-white",
              sizeClasses[size]
            )}
          >
            +{excess}
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
})

export { AvatarRoot, AvatarGroup }
