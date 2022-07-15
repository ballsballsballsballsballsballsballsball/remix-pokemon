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
import axios, { type AxiosResponse } from "axios";
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
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=54");

  const data: PokemonResponse = await response.json();

  return jsonTyped({
    pokemon: data.results,
  });
}

export default function Index() {
  const { pokemon: initialPokemon } = useLoaderDataTyped<typeof loader>();
  const [scroll, scrollTo] = useWindowScroll();
  const [pokemon, setPokemon] = useState<PokemonResponse["results"]>([]);
  const [fetchedPokemon, setFetchedPokemon] = useState<PokemonByNameResponse[]>(
    []
  );

  useEffect(() => {
    setPokemon(initialPokemon);
  }, [initialPokemon]);

  useEffect(() => {
    const fetchPokemon = async () => {
      await axios
        .all(pokemon.map(async (poke) => axios.get(poke.url)))
        .then((responses: any) => {
          setFetchedPokemon(
            responses.map((response: AxiosResponse) => response.data)
          );
        });
    };

    fetchPokemon();
  }, [pokemon]);

  useEffect(() => {
    const fetchMore = async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=200&offset=${pokemon.length}`
      );

      const data: PokemonResponse = await response.json();

      setPokemon([...pokemon, ...data.results]);
    };

    fetchMore();
  }, [pokemon]);

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
        sx={{
          width: "80%",
        }}
      >
        {fetchedPokemon.map((poke) => {
          return (
            <Grid.Col key={poke.name} span={12} lg={2}>
              <Card
                sx={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                <PokemonRenderer pokemon={poke} />
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

        {/* loading state */}
        {!fetchedPokemon.length && (
          <>
            {initialPokemon.map((poke) => (
              <Grid.Col key={poke.name} span={12} lg={2}>
                <Card
                  sx={{
                    textAlign: "center",
                    textTransform: "capitalize",
                  }}
                >
                  <Skeleton height={200} />

                  <Text>{poke.name}</Text>

                  <Skeleton width="100%" height={20} />

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
            ))}
          </>
        )}
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

const PokemonRenderer = ({ pokemon }: { pokemon: PokemonByNameResponse }) => {
  return (
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
          alt={pokemon.name}
          height={200}
        />
      )}
      <Text>{pokemon.name}</Text>
      <Group position="center">
        {pokemon?.types.map(({ type }) => {
          return <div key={type.name}>{renderType(type.name)}</div>;
        })}
      </Group>
    </>
  );
};
