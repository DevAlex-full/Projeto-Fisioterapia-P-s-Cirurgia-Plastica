import { Helmet } from 'react-helmet-async'

const defaultTitle = 'Débora Santiago | Fisioterapia Pós-Operatória e Pós-Cirurgia Plástica'

const defaultDescription =
  'Fisioterapia especializada em pós-operatório de cirurgia plástica, drenagem linfática, recuperação pós-cirúrgica e reabilitação com atendimento em clínica, parceiros e domicílio.'

const defaultImage = 'https://www.deborasantiago.com/logo.png'
const siteUrl = 'https://www.deborasantiago.com'

export default function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = siteUrl,
  type = 'website',
}) {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Débora Santiago" />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}