import * as React from "react"
import { cn } from "@/utils/cn"

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props} />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

// Wrapper to provide state management if not using a library like Radix
const TabsProvider = ({ defaultValue, children, className }) => {
  const [value, setValue] = React.useState(defaultValue)
  
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, {
            children: React.Children.map(child.props.children, trigger => {
              return React.cloneElement(trigger, {
                'data-state': value === trigger.props.value ? 'active' : 'inactive',
                onClick: () => setValue(trigger.props.value)
              })
            })
          })
        }
        if (child.type === TabsContent) {
          if (child.props.value !== value) return null
          return child
        }
        return child
      })}
    </div>
  )
}

export { TabsProvider as Tabs, TabsList, TabsTrigger, TabsContent }
