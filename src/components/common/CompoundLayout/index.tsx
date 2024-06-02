import BackButton from "./components/BackButton"
import { Background } from "./components/Background"
import { Content } from "./components/Content"
import { Footer } from "./components/Footer"
import { Head } from "./components/Head"
import { Header } from "./components/Header"
import { Headline } from "./components/Headline"
import { Root } from "./components/Root"
import { Section } from "./components/Section"

/**
 * A polymorphic composite component that generically displays the base of a page route.
 *
 * This could include:
 *
 * - Navigation bar
 * - Header
 * - Background
 * - Footer
 * - Page title, description
 * - HTML head elements
 *
 * ## Anatomy
 * 
 * @example
 * 
 * ```tsx
 *   <Layout.Root>
 *     <Layout.Head />
 *     <Layout.Section variant="header">
 *       <Layout.Background />
 *       <Layout.Header />
 *       <Layout.Headline />
 *     </Layout.Section>
 *     <Layout.Section variant="main">
 *       <Layout.Content />
 *     </Layout.Section>
 *   </Layout.Root>
 * ```
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
   * Displays an adjustable background that by default extends from top of `Section`
   * to top of `Content`
   */
  Background,
  /**
   * Main content of the page that `Layout` wraps around
   */
  Content,
  BackButton,
  /**
   * Header component that displays page title, description and other information
   */
  Headline,
  Section,
}
