import { initSupabase } from "../util/supabase/initSupabase";
import posthog from 'posthog-js'

initSupabase();

posthog.init('phc_uUfmJDekxvUV7KZcx2GCUljVs4PEnz9ejlyATkguZq2',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)