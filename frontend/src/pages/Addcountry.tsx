import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADD_COUNTRY = gql`
  mutation AddCountry($data: NewCountryInput!) {
    addCountry(data: $data) {
      name
      code
      emoji
    }
  }
`;

/* même query que celle utilisée par CountriesList pour que le cache puisse être mis à jour */
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

interface CountriesData {
  countries: Country[];
}

interface AddCountryData {
  addCountry: Country | null;
}

interface AddCountryVars {
  data: {
    name: string;
    code: string;
    emoji: string;
  };
}

export function AddCountry() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [emoji, setEmoji] = useState("");
  const navigate = useNavigate();

  const [addCountry, { loading, error }] = useMutation<AddCountryData, AddCountryVars>(ADD_COUNTRY, {
    refetchQueries: [{ query: COUNTRIES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted() {
      navigate("/index");
    },
    onError(err) {
      console.error("AddCountry mutation error:", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const c = code.trim();
    const em = emoji.trim();
    if (!n || !c || !em) return;
    try {
      await addCountry({
        variables: {
          data: { name: n, code: c, emoji: em },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Ajouter un pays</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nom:
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Code:
            <input value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Emoji:
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🇫🇷" />
          </label>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>

        {error ? (
          <div>
            <p>Erreur: {error.message}</p>
            {error.graphQLErrors?.length ? (
              <details>
                <summary>Détails GraphQL</summary>
                <pre>{JSON.stringify(error.graphQLErrors, null, 2)}</pre>
              </details>
            ) : null}
            {/* @ts-ignore */}
            {error.networkError?.result ? (
              <details>
                <summary>Network result</summary>
                {/* @ts-ignore */}
                <pre>{JSON.stringify(error.networkError.result, null, 2)}</pre>
              </details>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}