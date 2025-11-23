\connect testdb

BEGIN;
-- create enum invitationstatus
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_invitationstatus') THEN
        CREATE TYPE public.enum_invitationstatus AS ENUM
        (
            'accepted', 'pending', 'denied'
        );
    END IF;
END$$;

-- create type genre
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'genre_type') THEN
		CREATE TYPE genre_type AS (
		  id   int,
		  name text
		);
	END IF;
END$$;


CREATE TABLE IF NOT EXISTS public.favourite_movies
(
    favorite_id serial NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    CONSTRAINT favourite_movies_pkey PRIMARY KEY (favorite_id)
);

CREATE TABLE IF NOT EXISTS public.group_members
(
    member_id serial NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    membership_status enum_invitationstatus NOT NULL DEFAULT 'pending'::enum_invitationstatus,
    CONSTRAINT group_members_pkey PRIMARY KEY (member_id)
);

CREATE TABLE IF NOT EXISTS public.group_movie_suggestions
(
    suggestion_id serial NOT NULL,
    group_id integer NOT NULL,
    movie_id integer NOT NULL,
    suggested_by integer,
    score smallint,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    CONSTRAINT group_movie_suggestions_pkey PRIMARY KEY (suggestion_id)
);

CREATE TABLE IF NOT EXISTS public.groups
(
    group_id serial NOT NULL,
    group_name character varying(255)[] COLLATE pg_catalog."default" NOT NULL,
    owner_id integer NOT NULL,
    user_amount integer,
    CONSTRAINT "Groups_pkey" PRIMARY KEY (group_id)
);

CREATE TABLE IF NOT EXISTS public.movie_votes
(
    vote_id serial NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    score smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    review text COLLATE pg_catalog."default",
    public boolean NOT NULL DEFAULT false,
    CONSTRAINT movie_votes_pkey PRIMARY KEY (vote_id),
    CONSTRAINT "One per movie per user" UNIQUE (movie_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.movies
(
    movie_id integer NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    original_title text COLLATE pg_catalog."default",
    overview text COLLATE pg_catalog."default",
    genres genre_type[],
    status text COLLATE pg_catalog."default",
    release_date timestamp with time zone,
    in_theaters boolean NOT NULL DEFAULT false,
    poster_path text COLLATE pg_catalog."default",
    backdrop_path text COLLATE pg_catalog."default",
    vote_count integer,
    vote_average numeric,
    runtime integer,
    CONSTRAINT "Movies_pkey" PRIMARY KEY (movie_id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    user_id serial NOT NULL,
    username character varying(25) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    picture_path text COLLATE pg_catalog."default",
    "joinedGroups" integer[],
    CONSTRAINT "User_pkey" PRIMARY KEY (user_id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'movie_id'
      AND conrelid = 'public.favourite_movies'::regclass
  ) THEN
    ALTER TABLE public.favourite_movies
      ADD CONSTRAINT movie_id FOREIGN KEY (movie_id)
      REFERENCES public.movies (movie_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_id'
      AND conrelid = 'public.favourite_movies'::regclass
  ) THEN
    ALTER TABLE public.favourite_movies
      ADD CONSTRAINT user_id FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_group_id'
      AND conrelid = 'public.group_members'::regclass
  ) THEN
    ALTER TABLE public.group_members
      ADD CONSTRAINT fkey_group_id FOREIGN KEY (group_id)
      REFERENCES public.groups (group_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_user_id'
      AND conrelid = 'public.group_members'::regclass
  ) THEN
    ALTER TABLE public.group_members
      ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_group_id'
      AND conrelid = 'public.group_movie_suggestions'::regclass
  ) THEN
    ALTER TABLE public.group_movie_suggestions
      ADD CONSTRAINT fkey_group_id FOREIGN KEY (group_id)
      REFERENCES public.groups (group_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_movie_id'
      AND conrelid = 'public.group_movie_suggestions'::regclass
  ) THEN
    ALTER TABLE public.group_movie_suggestions
      ADD CONSTRAINT fkey_movie_id FOREIGN KEY (movie_id)
      REFERENCES public.movies (movie_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_movie_id'
      AND conrelid = 'public.movie_votes'::regclass
  ) THEN
    ALTER TABLE public.movie_votes
      ADD CONSTRAINT fkey_movie_id FOREIGN KEY (movie_id)
      REFERENCES public.movies (movie_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fkey_user_id'
      AND conrelid = 'public.movie_votes'::regclass
  ) THEN
    ALTER TABLE public.movie_votes
      ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
      NOT VALID;
  END IF;
END$$;

COMMIT;
