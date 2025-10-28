import { gql, useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

const COUNTRY_QUERY = gql`
  query Country($code: String!) {
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

export function Show() {
  const { code } = useParams<{ code: string }>();
  const { data, loading, error } = useQuery<Data>(COUNTRY_QUERY, {
    variables: { code },
    skip: !code,
    errorPolicy: "all",
    onError: (e) => console.error("useQuery onError:", e),
  });

  if (!code) return <p>Code de pays manquant</p>;
  if (loading) return <p>Chargement…</p>;

  if (error) {
    console.error("Apollo error object:", error);
    return (
      <div>
        <p>Erreur: {error.message}</p>
        {error.graphQLErrors?.length ? (
          <details>
            <summary>Détails GraphQL</summary>
            <pre>{JSON.stringify(error.graphQLErrors, null, 2)}</pre>
          </details>
        ) : null}
        {error.networkError ? (
          <details>
            <summary>Network error</summary>
            <pre>{JSON.stringify(error.networkError, null, 2)}</pre>
          </details>
        ) : null}
        <p>
          <Link to="/index">← Retour à la liste</Link>
        </p>
      </div>
    );
  }

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