import './spinner.css'

import { Apple } from "lucide-react";

export const Spinner = ({ className }) => {
    const combinedClasses = `spinner ${className || ""}`

    return (
        <div className={combinedClasses}><Apple /></div>
    )
}