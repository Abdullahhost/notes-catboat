

// const LoadingBUtton = () => {
//   return (
//     <div>

import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./button"

type LoadingBUttonProps = {
    loading: boolean
} & ButtonProps

export default function LoadingBUtton({
    children,
    loading,
    ...props
}: LoadingBUttonProps) {
    return (
        <Button {...props} disabled={props.disabled || loading}>
            {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {children}
        </Button>
    )

}