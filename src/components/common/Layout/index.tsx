import { Header } from "@/components/Header"
import LegacyLayout from "./Layout"
import { BackToExplorerButton } from "./components/BackToExplorerButton"
import Background from "./components/Background"
import Footer from "./components/Footer"
import Head from "./components/Head"
import HeaderSection from "./components/HeaderSection"
import Headline from "./components/Headline"
import MainSection from "./components/MainSection"
import Root from "./components/Root"

export default LegacyLayout

/**
 * A polymorphic compound component that generically displays the base of a page
 * route.
 *
 * This could include:
 *
 * - Navigation bar
 * - Header
 * - Background
 * - Footer
 * - Page title, description
 * - HTML head elements
 * - Margins and alignments
 *
 * ## Anatomy
 *
 * @example
 *   const Page = () => (
 *     <Layout.Root>
 *       <Layout.Head />
 *       <Layout.HeaderSection>
 *         <Layout.Background />
 *         <Layout.Header />
 *         <Layout.Headline />
 *       </Layout.HeaderSection>
 *       <Layout.MainSection />
 *     </Layout.Root>
 *   )
 */
export const Layout = {
  /**
   * Top level component of `Layout`
   *
   * Intended to be used on an empty page
   *
   * For specifing `maxWidth` property, use `sizes.container.<size>`
   */
  Root,
  Header,
  Footer,
  /** `NextHead` wrapper for page metadata */
  Head,
  /**
   * Displays an adjustable background
   *
   * Fills the area of `Layout.HeaderSection` then extends vertically by
   * `backgroundOffset`
   */
  Background,
  BackToExplorerButton,
  /** Displays page title, description and other information */
  Headline,
  /** Wraps main page content */
  MainSection,
  /** Wraps top-level page content */
  HeaderSection,
}
