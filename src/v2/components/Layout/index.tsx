import BackButton from "./BackButton"
import Background from "./Background"
import Footer from "./Footer"
import Head from "./Head"
import Header from "./Header"
import HeaderSection from "./HeaderSection"
import Headline from "./Headline"
import MainSection from "./MainSection"
import Root from "./Root"

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
  BackButton,
  /** Displays page title, description and other information */
  Headline,
  /** Wraps main page content */
  MainSection,
  /** Wraps top-level page content */
  HeaderSection,
}
