import BackButton from "./components/BackButton"
import Background from "./components/Background"
import Content from "./components/Content"
import Footer from "./components/Footer"
import Head from "./components/Head"
import Header from "./components/Header"
import HeaderSection from "./components/HeaderSection"
import Headline from "./components/Headline"
import MainSection from "./components/MainSection"
import Root from "./components/Root"

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
 *       <Layout.MainSection>
 *         <Layout.Content />
 *       </Layout.MainSection>
 *     </Layout.Root>
 *   )
 */
export const Layout = {
  /**
   * Top level component of `Layout`
   *
   * Intended to be used on an empty page route
   *
   * For specifing `maxWidth` property, use `sizes.container.<size>`
   */
  Root,
  Header,
  Footer,
  /** `NextHead` wrapper for page metadata */
  Head,
  /**
   * `HeaderSection` component that displays an adjustable background
   *
   * Fills the area of `HeaderSection` + `backgroundOffset`
   */
  Background,
  /** Main content of the page that `Layout` wraps around */
  Content,
  BackButton,
  /**
   * `HeaderSection` component that displays page title, description and other
   * information
   */
  Headline,
  /** Wraps main page content */
  MainSection,
  /** Wraps top-level page content */
  HeaderSection,
}
