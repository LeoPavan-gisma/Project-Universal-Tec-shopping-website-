import React from 'react'

export default function Footer() {
    return (
        <footer className="mt-12 py-6 bg-white/10 text-white backdrop-blur-sm">
            <div className="container mx-auto text-center text-sm">
                <div className="text-lg font-semibold">Universal Tech Shop</div>
                <div className="mt-1">CEO: Leo Pavan Kumar Thirumala Reddy</div>
                <div className="mt-1">Degree: MS Eng, Computer Science</div>
                <div className="mt-1">Contact: 359**********</div>
                <div className="mt-2 text-xs text-gray-200">© {new Date().getFullYear()} Universal Tech Shop</div>
            </div>
        </footer>
    )
}
