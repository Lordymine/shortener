import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white hover:bg-white/10">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-navy border-l-brand-light-navy text-white p-6 sm:max-w-xs transition-all duration-300">
                <SheetHeader className="pb-6 border-b border-white/10 mb-6 text-left space-y-0">
                    <SheetTitle className="text-left text-white font-bold text-2xl">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 px-1">
                    <a href="#" className="text-xl font-medium text-slate-300 hover:text-white hover:translate-x-2 transition-all block py-2">Platform</a>
                    <a href="#" className="text-xl font-medium text-slate-300 hover:text-white hover:translate-x-2 transition-all block py-2">Solutions</a>
                    <a href="#" className="text-xl font-medium text-slate-300 hover:text-white hover:translate-x-2 transition-all block py-2">Pricing</a>
                    <hr className="border-white/10 my-2" />
                    <a href="#" className="text-xl font-medium text-slate-300 hover:text-white hover:translate-x-2 transition-all block py-2">Log in</a>
                    <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold w-full h-12 text-lg shadow-lg shadow-brand-orange/20 mt-2">
                        Sign up Free
                    </Button>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
