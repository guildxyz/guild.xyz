import BackButton from "./components/BackButton"
import Background from "./components/Background"
import Footer from "./components/Footer"
import Header from "./components/Header"
import HeaderSection from "./components/HeaderSection"
import Headline from "./components/Headline"
import MainSection from "./components/MainSection"
import Root from "./components/Root"
import LegacyLayout from "./Layout"

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
  /**
   * Displays an adjustable background
   *
   * Fills the area of `Layout.HeaderSection` then extends vertically by
   * `backgroundOffset`
   */
  Background,
  BackButton,
  /** Displays page title, description, icon and creates page metadata */
  Headline,
  /** Wraps main page content */
  MainSection,
  /** Wraps top-level page content */
  HeaderSection,
}
