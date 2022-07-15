import { Card, Grid, Image, Text, Title } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { jsonTyped, useLoaderDataTyped } from "~/utils";

type PokemonResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

type PokemonByNameResponse = {
  sprites: {
    front_default: string;
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
          };
        };
      };
    };
  };
};

export async function loader() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");

  const data: PokemonResponse = await response.json();

  return jsonTyped({
    pokemon: data.results,
  });
}

export default function Index() {
  const { pokemon } = useLoaderDataTyped<typeof loader>();

  return (
    <div
      style={{
        wordBreak: "break-all",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Title>Poke man</Title>

      <Grid
        grow
        sx={{
          width: "80%",
        }}
      >
        {pokemon.map((poke) => {
          return (
            <Grid.Col key={poke.url} span={12} lg={2}>
              <Card
                sx={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                <Pokemon name={poke.name} url={poke.url} />
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </div>
  );
}

const Pokemon = ({ name, url }: { name: string; url: string }) => {
  const [pokemon, setPokemon] = useState<PokemonByNameResponse | null>(null);
  useEffect(() => {
    const fetchPokemon = async () => {
      const data = await fetch(url);
      const json = await data.json();
      setPokemon(json);
    };

    fetchPokemon();
  }, [name]);

  return (
    <>
      {pokemon &&
        (pokemon.sprites.versions["generation-v"]["black-white"].animated
          .front_default ??
          pokemon.sprites.front_default) && (
          <Image
            src={
              pokemon.sprites.versions["generation-v"]["black-white"].animated
                .front_default ?? pokemon.sprites.front_default
            }
            sx={{
              imageRendering: "pixelated",
            }}
            alt={name}
            height={200}
          />
        )}
      <Text>{name}</Text>
    </>
  );
};
