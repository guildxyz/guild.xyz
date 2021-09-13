import { GetServerSideProps } from "next"

const getServerSideProps: GetServerSideProps = async ({ preview, resolvedUrl }) => {
  if (!preview)
    return {
      redirect: {
        destination: `/api/preview?returnUrl=${resolvedUrl.split("?")[0]}`,
        permanent: false,
      },
      props: {},
    }

  return {
    props: {},
  }
}

// eslint-disable-next-line import/prefer-default-export
export { getServerSideProps }
