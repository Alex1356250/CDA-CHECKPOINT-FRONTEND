import { gql, useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

const COUNTRY_QUERY = gql`
  query Country($code: ID!) {
    country(code: $code) {
      name
      code
      emoji
      continent {
        name
      }
    }
  }
`;

interface CountryDetail {
  name: string;
  code: string;
  emoji: string;
  continent?: { name: string | null } | null;
}

interface Data {
  country: CountryDetail | null;
}

export function ShowCountry() {
  const { code } = useParams<{ code: string }>();
  const { data, loading, error } = useQuery<Data>(COUNTRY_QUERY, {
    variables: { code },
    skip: !code,
  });

  if (!code) return <p>Code de pays manquant</p>;
  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur: {error.message}</p>;
  if (!data?.country) return <p>Pays introuvable</p>;

  const c = data.country;
  return (
    <div>
      <h2>
        {c.emoji} {c.name} ({c.code})
      </h2>
      <p>Continent: {c.continent?.name ?? "Non renseigné"}</p>
      <p>
        <Link to="/index">← Retour à la liste</Link>
      </p>
    </div>
  );
}