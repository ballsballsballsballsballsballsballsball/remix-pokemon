import {
  Affix,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Skeleton,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { jsonTyped, useLoaderDataTyped } from "~/utils";
import { renderType } from "./pokemon/$name";

type PokemonResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonByNameResponse = {
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
  name: string;
  order: number;
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
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
  const [scroll, scrollTo] = useWindowScroll();

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
                <Link
                  to={`/pokemon/${poke.name}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button fullWidth variant="light" mt={2}>
                    View
                  </Button>
                </Link>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
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
  }, [name, url]);

  //
  return (
    <>
      {pokemon ? (
        <>
          {(pokemon.sprites.versions["generation-v"]["black-white"].animated
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
        </>
      ) : (
        <Skeleton height={200} />
      )}
      <Text>{name}</Text>
      <Group position="center">
        {pokemon ? (
          <>
            {pokemon?.types.map(({ type }) => {
              return <div key={type.name}>{renderType(type.name)}</div>;
            })}
          </>
        ) : (
          <Skeleton width="100%" height={20} />
        )}
      </Group>
    </>
  );
};
