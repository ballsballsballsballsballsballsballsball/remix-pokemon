import { Badge, Button, Card, Group, Image, Text, Title } from "@mantine/core";
import { type DataFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { jsonTyped, useLoaderDataTyped } from "~/utils";
import { type PokemonByNameResponse } from "..";

export async function loader({ params }: DataFunctionArgs) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${params.name}`
  );

  const data: PokemonByNameResponse = await response.json();

  return jsonTyped({
    pokemon: data,
  });
}

export const renderType = (name: string) => {
  // thanks copilot
  switch (name) {
    case "normal":
      return <Badge color="green">{name}</Badge>;
    case "fighting":
      return <Badge color="red">{name}</Badge>;
    case "flying":
      return <Badge color="blue">{name}</Badge>;
    case "poison":
      return <Badge color="purple">{name}</Badge>;
    case "ground":
      return <Badge color="orange">{name}</Badge>;
    case "rock":
      return <Badge color="brown">{name}</Badge>;
    case "bug":
      return <Badge color="yellow">{name}</Badge>;
    case "ghost":
      return <Badge color="gray">{name}</Badge>;
    case "steel":
      return <Badge color="light-gray">{name}</Badge>;
    case "fire":
      return <Badge color="red">{name}</Badge>;
    case "water":
      return <Badge color="blue">{name}</Badge>;
    case "grass":
      return <Badge color="green">{name}</Badge>;
    case "electric":
      return <Badge color="yellow">{name}</Badge>;
    case "psychic":
      return <Badge color="purple">{name}</Badge>;
    case "ice":
      return <Badge color="blue">{name}</Badge>;
    case "dragon":
      return <Badge color="green">{name}</Badge>;
    case "dark":
      return <Badge color="purple">{name}</Badge>;
    case "fairy":
      return <Badge color="pink">{name}</Badge>;
    default:
      return <Badge color="gray">{name}</Badge>;
  }
};

const renderStats = (stats: PokemonByNameResponse["stats"]) => {
  return stats.map((stat) => {
    return (
      <Text
        key={stat.stat.name}
        sx={{
          textTransform: "uppercase",
        }}
      >
        {stat.stat.name}: {stat.base_stat}
      </Text>
    );
  });
};

export default function Show() {
  const { pokemon } = useLoaderDataTyped<typeof loader>();

  console.log(pokemon);

  const pokemonImg =
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      .front_default ?? pokemon.sprites.front_default;

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
      <Image
        src={pokemonImg}
        height={200}
        sx={{
          imageRendering: "pixelated",
          transform: "translateY(25%)",
          zIndex: 1,
        }}
      />
      <Card
        sx={{
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <Text>#{pokemon.order}</Text>
        <Title
          sx={{
            textTransform: "capitalize",
          }}
        >
          {pokemon.name}
        </Title>
        <Group position="center">
          {pokemon.types.map(({ type }) => {
            return <div key={type.name}>{renderType(type.name)}</div>;
          })}
        </Group>

        <Title order={3}>Stats</Title>
        <Group>{renderStats(pokemon.stats)}</Group>
      </Card>

      <Link to={`/`} style={{ textDecoration: "none" }}>
        <Button fullWidth variant="light" mt={2}>
          Back
        </Button>
      </Link>
    </div>
  );
}
