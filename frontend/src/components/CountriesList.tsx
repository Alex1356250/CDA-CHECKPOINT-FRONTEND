import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      name
      code
      emoji
    }
  }
`;

interface Country {
  name: string;
  code: string;
  emoji: string;
}

interface Data {
  countries: Country[];
}

export function CountriesList() {
  const { data } = useQuery<Data>(COUNTRIES_QUERY);
  return (
    <ul className="countries-grid">
      {data?.countries.map((c) => (
        <li key={c.code}>
          <Link to={`/showcountry/${c.code}`} style={{ textDecoration: "none", color: "inherit" }}>
            <span className="country-emoji" style={{ marginRight: 8 }}>{c.emoji}</span>
            <div className="country-title">{c.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}