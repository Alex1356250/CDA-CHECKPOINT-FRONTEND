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

  const c = data.country;
  return (
    <div className="main-container country-detail">
      <div className="country-emoji" aria-hidden>
        <div>
          {c.emoji}
        </div>
      <h2 className="meta">
        {c.name} ({c.code})
      </h2>
      <p className="meta">Continent: {c.continent?.name ?? "Non renseigné"}</p>
      <p>
        <Link to="/index" className="back-link">← Retour à la liste</Link>
      </p>
      </div>
    </div>
  );
}