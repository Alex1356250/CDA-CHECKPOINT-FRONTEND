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
    <div className="main-container">
      <div className="form-card" role="region" aria-label="Ajouter un pays">
        <form onSubmit={handleSubmit} style={{display:"contents"}}>
          <div className="field">
            <label>Nom:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Emoji:</label>
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🇫🇷" />
          </div>
          <div className="field">
            <label>Code:</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div style={{display:"flex",alignItems:"center"}}>
            <button className="btn-add" type="submit" disabled={loading}>
              {loading ? "Ajout..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}