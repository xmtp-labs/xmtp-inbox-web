import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-screen bg-white">
        <Head>
          <meta name="description" content="Chat via XMTP" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700|Inconsolata:400,600,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
