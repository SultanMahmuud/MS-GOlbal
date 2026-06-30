"use client"

import { ChevronRight, LucideProps } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/UI/sidebar"
import { IconType } from "react-icons"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconType
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            (item.items?.some((subItem) => pathname === subItem.url))

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url} passHref>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`w-full ${isParentActive ? "bg-green-300" : ""} hover:bg-none`}
                    >
                      <div className="flex items-center gap-3 w-full text-[18px] font-medium">
                        {item.icon && <item.icon className="shrink-0" />}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>

                {/* Submenu */}
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <Link href={subItem.url} passHref>
                              <SidebarMenuSubButton
                                asChild
                                className={`${isSubActive ? "bg-green-100" : ""} hover:bg-none`}
                              >
                                <span className="">{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
