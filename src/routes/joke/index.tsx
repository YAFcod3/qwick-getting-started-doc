import { component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, server$ } from "@builder.io/qwik-city";
import styles from "./index.css?inline";




export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log("VOTE", props);
});

//ssr
export const useDadJoke = routeLoader$(async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
  }).then((res) => res.json());

  console.log(response);

  return response as {
    id: string;
    status: number;
    joke: string;
  };
});


//component

export default component$(() => {

  useStylesScoped$(styles);

  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);



//eje del lado del serv
  useTask$(({ track }) => {
    track(()=> isFavoriteSignal.value);

    console.log({favoriteSignal:isFavoriteSignal.value})
  });


  server$(() => {
    console.log('FAVORITE (server)', isFavoriteSignal.value);
  })();




  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">
          👍
        </button>
        <button name="vote" value="down">
          👎
        </button>
      </Form>

      <button
        onClick$={() => {
          isFavoriteSignal.value = !isFavoriteSignal.value;
        }}
      >
        {isFavoriteSignal.value ? "❤️" : "🤍"}
      </button>
    </section>
  );
});
