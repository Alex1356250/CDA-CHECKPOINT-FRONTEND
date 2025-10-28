export const COUNTRIES_QUERY = `query Countries {
  countries {
    name
    emoji
  }
}`;

export interface Country {
  name: string;
  emoji: string;
}

export interface CountriesResponse {
  countries: Country[];
}

/**
 * Petit helper pour appeler l'API GraphQL avec la query ci‑dessus.
 * Utiliser fetchCountries('https://your-graphql-endpoint.com/graphql')
 */
export async function fetchCountries(graphqlEndpoint: string, options?: RequestInit) {
  const res = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: COUNTRIES_QUERY }),
    ...options,
  });
  const json = await res.json();
  return json as { data: CountriesResponse };
}

/// REQUETE POUR PAGE DEDIEE

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

export interface CountryDetail {
  name: string;
  code: string;
  emoji: string;
  continent?: { name: string | null } | null;
}

export interface CountryResponse {
  country: CountryDetail | null;
}

export async function fetchCountry(graphqlEndpoint: string, code: string, options?: RequestInit) {
  const res = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: COUNTRY_QUERY, variables: { code } }),
    ...options,
  });
  const json = await res.json();
  return json as { data: CountryResponse };
}


//// REQUETE POUR AJOUT D'UN PAYS

// Mutation pour ajouter un pays (exemple prenant name, code et emoji en variables)
export const ADD_COUNTRY_MUTATION = `mutation AddCountry($data: NewCountryInput!) {
  addCountry(data: $data) {
    name
    code
    emoji
  }
}`;

export interface NewCountry {
  name: string;
  code: string;
  emoji: string;
}

export interface AddCountryResponse {
  addCountry: NewCountry | null;
}

/**
 * Envoie la mutation pour ajouter un pays.
 * Retourne l'objet ajouté (ou null si échec côté API).
 */
export async function addcountry(graphqlEndpoint: string, country: NewCountry, options?: RequestInit) {
  const res = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ADD_COUNTRY_MUTATION,
      variables: { data: { name: country.name, code: country.code, emoji: country.emoji } },
    }),
    ...options,
  });
  const json = await res.json();
  return json as { data: AddCountryResponse };
}
