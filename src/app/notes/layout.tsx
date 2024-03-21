import Navbar from "./components/Navbar"

export default function Layout({ children }: Readonly<{
	children: React.ReactNode
}>) {

	return (
		<>
			<Navbar />
			<main className="m-auto max-w-7xl py-3">
				{children}
			</main>
		</>
	)

}