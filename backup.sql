--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE clothing_db;




--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Ux78s9fGy85uh18fMTJ1+w==$+KU/lRPELrGyNPeqOZne3BpPx2WJF9MqUkDtX231A9M=:j2+tXr2BKnbWida15NLPo3d1BnxRZJzg8fhK1QB5nwc=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "clothing_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: clothing_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE clothing_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE clothing_db OWNER TO postgres;

\connect clothing_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: audit_phone_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_phone_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        OLD.phone_id, OLD.user_id, OLD.number, OLD.type, 'DELETE'
    );
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.audit_phone_delete() OWNER TO postgres;

--
-- Name: audit_phone_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_phone_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        NEW.phone_id, NEW.user_id, NEW.number, NEW.type, 'INSERT'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.audit_phone_insert() OWNER TO postgres;

--
-- Name: audit_phone_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_phone_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO phones_audit (
        phone_id, user_id, number, type, operation_type
    ) VALUES (
        OLD.phone_id, OLD.user_id, OLD.number, OLD.type, 'UPDATE'
    );
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.audit_phone_update() OWNER TO postgres;

--
-- Name: audit_product_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_product_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        OLD.id, OLD.name, OLD.description, OLD.price, OLD.stock, OLD.created_at,
        OLD.category_id, OLD.color_id, OLD.size_id, OLD.gender_id, OLD.active, 'DELETE'
    );
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.audit_product_delete() OWNER TO postgres;

--
-- Name: audit_product_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_product_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        NEW.id, NEW.name, NEW.description, NEW.price, NEW.stock, NEW.created_at,
        NEW.category_id, NEW.color_id, NEW.size_id, NEW.gender_id, NEW.active, 'INSERT'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.audit_product_insert() OWNER TO postgres;

--
-- Name: audit_product_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_product_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO products_audit (
        product_id, name, description, price, stock, created_at, category_id,
        color_id, size_id, gender_id, active, operation_type
    ) VALUES (
        NEW.id, NEW.name, NEW.description, NEW.price, NEW.stock, NEW.created_at,
        NEW.category_id, NEW.color_id, NEW.size_id, NEW.gender_id, NEW.active, 'UPDATE'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.audit_product_update() OWNER TO postgres;

--
-- Name: audit_user_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_user_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type
    ) VALUES (
        OLD.id, OLD.personal_id, OLD.entity_type, OLD.name, OLD.gender, 
        OLD.email, OLD.password, OLD.role, OLD.created_at, OLD.birthdate, 
        OLD.address, OLD.number, OLD.neighborhood, OLD.city, OLD.country, 
        OLD.active, OLD.last_login, 'DELETE'
    );
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.audit_user_delete() OWNER TO postgres;

--
-- Name: audit_user_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_user_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type
    ) VALUES (
        NEW.id, NEW.personal_id, NEW.entity_type, NEW.name, NEW.gender, 
        NEW.email, NEW.password, NEW.role, NEW.created_at, NEW.birthdate, 
        NEW.address, NEW.number, NEW.neighborhood, NEW.city, NEW.country, 
        NEW.active, NEW.last_login, 'INSERT'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.audit_user_insert() OWNER TO postgres;

--
-- Name: audit_user_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_user_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO users_audit (
        user_id, personal_id, entity_type, name, gender, email, password, role, 
        created_at, birthdate, address, number, neighborhood, city, country, 
        active, last_login, operation_type, changed_at
    ) VALUES (
        OLD.id, OLD.personal_id, OLD.entity_type, OLD.name, OLD.gender, OLD.email, 
        OLD.password, OLD.role, OLD.created_at, OLD.birthdate, OLD.address, 
        OLD.number, OLD.neighborhood, OLD.city, OLD.country, OLD.active, 
        OLD.last_login, 'UPDATE', CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.audit_user_update() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: colors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colors (
    color_id integer NOT NULL,
    name text NOT NULL,
    hex_code text
);


ALTER TABLE public.colors OWNER TO postgres;

--
-- Name: colors_color_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colors_color_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colors_color_id_seq OWNER TO postgres;

--
-- Name: colors_color_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colors_color_id_seq OWNED BY public.colors.color_id;


--
-- Name: genders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genders (
    gender_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.genders OWNER TO postgres;

--
-- Name: genders_gender_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genders_gender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genders_gender_id_seq OWNER TO postgres;

--
-- Name: genders_gender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genders_gender_id_seq OWNED BY public.genders.gender_id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    order_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status (
    status_id integer NOT NULL,
    status_name text NOT NULL
);


ALTER TABLE public.order_status OWNER TO postgres;

--
-- Name: order_status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_status_id_seq OWNER TO postgres;

--
-- Name: order_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_status_id_seq OWNED BY public.order_status.status_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id text NOT NULL,
    user_id text NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_id integer NOT NULL,
    total numeric(10,2) NOT NULL,
    tracking_code text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: phones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phones (
    phone_id text NOT NULL,
    user_id text NOT NULL,
    number text NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.phones OWNER TO postgres;

--
-- Name: phones_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phones_audit (
    id integer NOT NULL,
    phone_id text NOT NULL,
    user_id text NOT NULL,
    number text,
    type text,
    operation_type text NOT NULL,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changed_by text
);


ALTER TABLE public.phones_audit OWNER TO postgres;

--
-- Name: phones_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phones_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phones_audit_id_seq OWNER TO postgres;

--
-- Name: phones_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phones_audit_id_seq OWNED BY public.phones_audit.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id text NOT NULL,
    product_id text NOT NULL,
    url text NOT NULL,
    alt text
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_id integer,
    color_id integer,
    size_id integer,
    gender_id integer,
    active boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_audit (
    id integer NOT NULL,
    product_id text NOT NULL,
    name text,
    description text,
    price numeric(10,2),
    stock integer,
    created_at timestamp without time zone,
    category_id integer,
    color_id integer,
    size_id integer,
    gender_id integer,
    active boolean,
    operation_type text NOT NULL,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changed_by text
);


ALTER TABLE public.products_audit OWNER TO postgres;

--
-- Name: products_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_audit_id_seq OWNER TO postgres;

--
-- Name: products_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_audit_id_seq OWNED BY public.products_audit.id;


--
-- Name: sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sizes (
    size_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.sizes OWNER TO postgres;

--
-- Name: sizes_size_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sizes_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sizes_size_id_seq OWNER TO postgres;

--
-- Name: sizes_size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sizes_size_id_seq OWNED BY public.sizes.size_id;


--
-- Name: ticket_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_status (
    id integer NOT NULL,
    status character varying(50) NOT NULL
);


ALTER TABLE public.ticket_status OWNER TO postgres;

--
-- Name: ticket_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ticket_status_id_seq OWNER TO postgres;

--
-- Name: ticket_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_status_id_seq OWNED BY public.ticket_status.id;


--
-- Name: ticket_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_types (
    id integer NOT NULL,
    type_name character varying(255) NOT NULL
);


ALTER TABLE public.ticket_types OWNER TO postgres;

--
-- Name: ticket_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ticket_types_id_seq OWNER TO postgres;

--
-- Name: ticket_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_types_id_seq OWNED BY public.ticket_types.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id text NOT NULL,
    user_id text NOT NULL,
    type_id integer,
    user_name text NOT NULL,
    user_email text NOT NULL,
    user_phone_number text NOT NULL,
    description text NOT NULL,
    solution text,
    analist_name text,
    analist_email text,
    status_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    personal_id text NOT NULL,
    entity_type text NOT NULL,
    name text NOT NULL,
    gender integer,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    birthdate date NOT NULL,
    address text NOT NULL,
    number text NOT NULL,
    neighborhood text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    active boolean DEFAULT true,
    last_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_audit (
    id integer NOT NULL,
    user_id text NOT NULL,
    personal_id text,
    entity_type text,
    name text,
    gender text,
    email text,
    password text,
    role text,
    created_at timestamp without time zone,
    birthdate date,
    address text,
    number text,
    neighborhood text,
    city text,
    country text,
    active boolean,
    last_login timestamp without time zone,
    operation_type text NOT NULL,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changed_by text
);


ALTER TABLE public.users_audit OWNER TO postgres;

--
-- Name: users_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_audit_id_seq OWNER TO postgres;

--
-- Name: users_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_audit_id_seq OWNED BY public.users_audit.id;


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_items (
    wishlist_id text NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.wishlist_items OWNER TO postgres;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    wishlist_id text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: colors color_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colors ALTER COLUMN color_id SET DEFAULT nextval('public.colors_color_id_seq'::regclass);


--
-- Name: genders gender_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders ALTER COLUMN gender_id SET DEFAULT nextval('public.genders_gender_id_seq'::regclass);


--
-- Name: order_status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status ALTER COLUMN status_id SET DEFAULT nextval('public.order_status_status_id_seq'::regclass);


--
-- Name: phones_audit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones_audit ALTER COLUMN id SET DEFAULT nextval('public.phones_audit_id_seq'::regclass);


--
-- Name: products_audit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit ALTER COLUMN id SET DEFAULT nextval('public.products_audit_id_seq'::regclass);


--
-- Name: sizes size_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes ALTER COLUMN size_id SET DEFAULT nextval('public.sizes_size_id_seq'::regclass);


--
-- Name: ticket_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status ALTER COLUMN id SET DEFAULT nextval('public.ticket_status_id_seq'::regclass);


--
-- Name: ticket_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_types ALTER COLUMN id SET DEFAULT nextval('public.ticket_types_id_seq'::regclass);


--
-- Name: users_audit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_audit ALTER COLUMN id SET DEFAULT nextval('public.users_audit_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, name, description) FROM stdin;
1	T-Shirts	Casual shirts typically made from cotton or synthetic materials.
2	Jeans	Denim pants available in various cuts and styles.
3	Jackets	Outerwear for protection against cold and rain.
4	Dresses	One-piece garments for women and girls.
5	Sweaters	Knit garments for warmth.
6	Shorts	Casual wear for warm weather.
7	Hoodies	Sweatshirts with hoods for casual wear.
8	Skirts	Garments that hang from the waist and come in various lengths.
9	Suits	Formal attire including jackets and trousers or skirts.
10	Activewear	Clothing designed for exercise and sports.
11	Blazers	Formal jackets often worn with suits or dress pants.
12	Coats	Heavy outerwear for cold weather.
13	Cardigans	Open-front sweaters that can be buttoned up.
14	Vests	Sleeveless garments worn over shirts or blouses.
15	Leggings	Tight-fitting pants made from stretchy fabric.
16	Overalls	Garments with a bib and shoulder straps, often worn over other clothes.
17	Bathrobes	Robes worn after bathing or lounging.
18	Tunics	Loose-fitting tops that often cover the hips and thighs.
19	Pajamas	Comfortable clothing worn for sleeping.
20	Shirts	Button-down shirts that can be dressed up or down.
21	Winter Wear	Clothing items specifically designed for winter.
\.


--
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colors (color_id, name, hex_code) FROM stdin;
1	Red	#FF0000
2	Blue	#0000FF
3	Green	#008000
4	Black	#000000
5	White	#FFFFFF
6	Gray	#808080
7	Yellow	#FFFF00
8	Pink	#FFC0CB
9	Purple	#800080
10	Orange	#FFA500
11	Gray	#808080
12	Yellow	#FFFF00
13	Pink	#FFC0CB
14	Purple	#800080
15	Orange	#FFA500
16	Brown	#A52A2A
17	Beige	#F5F5DC
18	Teal	#008080
19	Cyan	#00FFFF
20	Magentas	#FF00FF
\.


--
-- Data for Name: genders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genders (gender_id, name) FROM stdin;
1	Male
2	Female
3	Unisex
4	Not Aplicable
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
2128f20d-9bc1-472a-b871-079326d47c1e	2dd5701a-3b98-41b7-b9a0-bb09c03feb03	e85745de-032c-43e8-90dd-79c9d6489fb1	1	99.99
88f59a48-286f-49f8-bcd2-de39bd5adef1	2dd5701a-3b98-41b7-b9a0-bb09c03feb03	e7f9cab3-a7a0-400b-adcc-489f6e1faa6c	1	49.99
3a5b58cb-3737-4fa4-b5b1-08330a7e0126	2dd5701a-3b98-41b7-b9a0-bb09c03feb03	870d3b1b-a6d3-4255-893c-af31839c0ca7	1	119.99
cf8c8686-6698-426a-af7d-37f8a85598ac	c8db9d25-5a61-4f79-9b54-4544e7f46982	e85745de-032c-43e8-90dd-79c9d6489fb1	1	99.99
88874201-4de8-41d4-b20a-a12bea674380	c8db9d25-5a61-4f79-9b54-4544e7f46982	e7f9cab3-a7a0-400b-adcc-489f6e1faa6c	1	49.99
b0c8d147-c83a-488c-839e-483589d42b61	c8db9d25-5a61-4f79-9b54-4544e7f46982	870d3b1b-a6d3-4255-893c-af31839c0ca7	1	119.99
f9d0faef-652f-4f2a-9a62-1cb696754b24	22bc3950-38d8-41c2-9444-16cdd6741474	e85745de-032c-43e8-90dd-79c9d6489fb1	1	99.99
b442fcc2-e836-4ecf-b5a6-1fa16a5cbf25	22bc3950-38d8-41c2-9444-16cdd6741474	e7f9cab3-a7a0-400b-adcc-489f6e1faa6c	1	49.99
64c9d213-8e64-4583-b7c8-cd7c8777cc43	22bc3950-38d8-41c2-9444-16cdd6741474	870d3b1b-a6d3-4255-893c-af31839c0ca7	1	119.99
\.


--
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status (status_id, status_name) FROM stdin;
1	Pending
2	Processing
3	Shipped
4	Completed
5	Canceled
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, order_date, status_id, total, tracking_code) FROM stdin;
2dd5701a-3b98-41b7-b9a0-bb09c03feb03	e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04	2024-08-29 20:11:31.182	1	349.97	\N
c8db9d25-5a61-4f79-9b54-4544e7f46982	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	2024-08-29 20:23:03.634	1	349.97	\N
22bc3950-38d8-41c2-9444-16cdd6741474	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	2024-08-29 20:24:35.397	1	349.97	\N
\.


--
-- Data for Name: phones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phones (phone_id, user_id, number, type) FROM stdin;
18ed7943-2b24-455f-92ff-1010551c8461	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	+1-555-123-4567	Work
ce5173e6-f0f4-4328-946a-c2cade027e1e	8603cc1b-d667-4f4f-a5ec-989c403e560f	+34-600-123-456	Mobile
972f2b2c-4bd2-493b-8730-8be229db0358	8603cc1b-d667-4f4f-a5ec-989c403e560f	+34-601-987-654	Work
b62fa6f9-b71d-4cc7-bea3-3ad71cca39d8	c3d4dea2-6d46-45e4-9a1a-db2d1e8981fc	+353-1-234-5678	Mobile
86fcc4c7-5c81-4c02-b712-0a6d5336f68a	26315a23-2db7-4969-8f76-b975a5bcc5b6	+82-2-345-6789	Mobile
45df67f6-b195-4e37-9138-03e94fd16ee8	26315a23-2db7-4969-8f76-b975a5bcc5b6	+82-2-987-6543	Work
b0146f41-2200-4e3c-a2de-db149136113d	cdc56bc7-7e4d-42cf-82ec-e2b936e3ef7b	+55-21-98765-4321	Mobile
34eb88eb-d0f9-4c94-9385-1582954301ce	cdc56bc7-7e4d-42cf-82ec-e2b936e3ef7b	+55-21-12345-6789	Home
9246c3f1-98a1-49e2-bd57-7e35c6c20903	e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04	+44-20-7946-0958	Work
de8ac4a4-7433-42fd-9da4-9e0d3eda67a4	99c55bdc-9e39-4e47-922a-362aa48bdb34	+971-4-123-4567	Mobile
943a488f-33f0-4314-873f-4c7aa7f41fc2	64cdd6b7-13b5-423c-8aa4-c435853cfe86	+81-3-1234-5678	Mobile
7a132fb2-f459-45b1-a32c-e0623f5b1840	64cdd6b7-13b5-423c-8aa4-c435853cfe86	+81-3-8765-4321	Work
6f9c9cc9-4a08-4376-bd0b-9cbfb00e6144	b212fcc1-c5ee-4764-b1a0-ffa349daed18	+52-55-1234-5678	Mobile
1675903a-10fe-41a8-9838-27a3b8e79b50	8361d8ed-c05e-4158-ac72-d49b79f452bd	+46-8-123-4567	Mobile
527bbcbb-baa4-4464-b81c-85aef37e0aec	8361d8ed-c05e-4158-ac72-d49b79f452bd	+46-8-234-5678	Work
d4f77242-a4ed-410e-ae04-715c19928bee	f0ce9152-0166-467d-9f79-8aee7a6e770f	+966-1-234-5678	Mobile
5ff8cd4e-99d3-42f9-9836-3e3054a6f067	603a9774-2bc3-48c6-8454-78f03b75a4e5	+49-30-1234567	Mobile
39bdf530-6b42-4561-b7c3-408870ae2294	1aa7b223-8843-4efc-9007-c0eb5763f7ff	+1-416-123-4567	Mobile
fa969f76-4d3b-4773-a5ca-ecbddcb27e84	1aa7b223-8843-4efc-9007-c0eb5763f7ff	+1-416-234-5678	Home
21a1ffcb-0d74-4d42-ba0b-9173ed925ae9	8fceaae0-b3c7-4ce7-9318-20037194c05b	+86-10-1234-5678	Mobile
87fd21a8-381b-497c-9567-709c27cb813e	8fceaae0-b3c7-4ce7-9318-20037194c05b	+86-10-2345-6789	Home
a7c69602-91d1-49a2-9f16-f4e1b126d9b4	8fd08ce9-22de-4f21-8042-889da3820866	+48-22-123-4567	Mobile
68f0f901-a284-44e3-a6d7-682ff9dffe9f	8fd08ce9-22de-4f21-8042-889da3820866	+48-22-234-5678	Home
\.


--
-- Data for Name: phones_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phones_audit (id, phone_id, user_id, number, type, operation_type, changed_at, changed_by) FROM stdin;
5	21a1ffcb-0d74-4d42-ba0b-9173ed925ae9	8fceaae0-b3c7-4ce7-9318-20037194c05b	+86-10-1234-5678	Mobile	INSERT	2024-08-28 21:21:13.597134	\N
6	87fd21a8-381b-497c-9567-709c27cb813e	8fceaae0-b3c7-4ce7-9318-20037194c05b	+86-10-2345-6789	Home	INSERT	2024-08-28 21:21:13.696388	\N
7	a7c69602-91d1-49a2-9f16-f4e1b126d9b4	8fd08ce9-22de-4f21-8042-889da3820866	+48-22-123-4567	Mobile	INSERT	2024-08-29 17:47:20.435443	\N
8	68f0f901-a284-44e3-a6d7-682ff9dffe9f	8fd08ce9-22de-4f21-8042-889da3820866	+48-22-234-5678	Home	INSERT	2024-08-29 17:47:20.454854	\N
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, url, alt) FROM stdin;
d163c968-07c7-445e-a70d-5bc4cea29937	fd30b6b9-4531-465a-95b8-cf51a5e90c67	https://example.com/images/dress_front.jpg	Front view of the elegant Winter dress
f3484991-b0cb-468b-9dcf-7ad2b9caba73	fd30b6b9-4531-465a-95b8-cf51a5e90c67	https://example.com/images/dress_back.jpg	Back view of the elegant Winter dress
e2314630-613f-48db-bdb8-fad20ac215de	e85745de-032c-43e8-90dd-79c9d6489fb1	https://example.com/images/dress_front.jpg	Back view of the elegant Winter dress
cb738840-c031-4e69-9e5a-9a54d8cb28c9	9f68db76-e2ea-4fcd-bb0b-514c93d517e3	https://example.com/images/dress_front.jpg	Front view of the elegant Winter dress
33d44d91-bbf6-482a-bf2d-30305235bd78	9f68db76-e2ea-4fcd-bb0b-514c93d517e3	https://example.com/images/dress_back.jpg	Back view of the elegant Winter dress
261b8200-b868-44db-8757-d9060daf9b28	4eee4b11-a04f-419e-af7e-a3b7478328c0	https://example.com/images/dress_front.jpg	Front view of the elegant Winter dress
98b2c1b2-23de-4750-b0c9-bdaa306a3c22	4eee4b11-a04f-419e-af7e-a3b7478328c0	https://example.com/images/dress_back.jpg	Back view of the elegant Winter dress
6a28af97-76be-4283-b834-dc567f5b254c	fa820373-7028-4c31-93e2-40751265ed1d	https://example.com/images/dress_front.jpg	Front view of the elegant Winter dress
9f4f1225-d6e4-4d5d-80e9-7b5cefc86bda	fa820373-7028-4c31-93e2-40751265ed1d	https://example.com/images/dress_back.jpg	Back view of the elegant Winter dress
6932e494-e895-4617-93e6-9a14c90104ac	e85745de-032c-43e8-90dd-79c9d6489fb1	https://example.com/images/dress_backs12.jpg	Back view of the elegant Winter dress
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id, active) FROM stdin;
e85745de-032c-43e8-90dd-79c9d6489fb1	Elegant Wrap Dress	A stylish wrap dress that enhances any silhouette.	99.99	20	2024-08-21 20:22:27.898	5	5	3	1	t
e7f9cab3-a7a0-400b-adcc-489f6e1faa6c	Casual Plaid Shirt	A relaxed plaid shirt perfect for casual outings.	49.99	40	2024-08-21 20:22:39.877	1	4	2	2	t
870d3b1b-a6d3-4255-893c-af31839c0ca7	Stylish Suede Boots	Fashionable suede boots for a trendy look.	119.99	25	2024-08-21 20:22:48.667	4	3	4	2	t
9d841805-f14d-4b98-a58c-b07cc0823240	Modern Cargo Pants	Functional cargo pants with a modern design.	59.99	30	2024-08-21 20:22:58.395	3	2	3	2	t
c368d633-7374-4e7d-bdae-9c88ef2044da	Chic Printed Scarf	A stylish scarf with a chic print to complete any outfit.	29.99	45	2024-08-21 20:23:07.115	6	1	1	1	t
c75abcf0-e8a7-4904-9c1f-a70eb5831742	Comfortable Knit Dress	A cozy knit dress suitable for both casual and dressy occasions.	74.99	25	2024-08-21 20:23:17.085	5	15	4	1	t
9ba0f618-754c-48aa-8609-60458a8842b4	Elegant Silk Blouse	A luxurious silk blouse for sophisticated outfits.	89.99	20	2024-08-21 20:23:25.934	5	14	3	1	t
1154a121-b49e-43d5-8496-5241fc8a3c3b	Casual Polo Shirt	A comfortable polo shirt for casual wear.	39.99	50	2024-08-21 20:23:36.933	3	13	2	2	t
2e763e3e-0024-4def-883c-407f6c7ab362	Trendy Denim Jacket	A classic denim jacket with a modern twist.	89.99	30	2024-08-21 20:23:46.722	2	12	4	2	t
63e10790-91aa-4189-9162-bd63682b560f	Sleek Black Dress Shoes	Stylish black dress shoes for formal occasions.	129.99	30	2024-08-21 20:23:56.512	4	11	3	2	t
fbfec9c6-0c52-4a74-ae8e-477b226ba967	Soft Wool Sweater	A cozy wool sweater for cold winter days.	89.99	25	2024-08-21 20:24:06.645	6	10	4	1	t
991c6201-f0bf-4a22-afd1-a536e2171b75	Comfortable Jogger Pants	Comfortable joggers for relaxing or casual outings.	49.99	40	2024-08-21 20:24:15.34	3	9	3	2	t
02e6094d-4fee-4466-b62d-8acc47a548ba	Vintage Bomber Jacket	A stylish bomber jacket with a vintage flair.	99.99	20	2024-08-21 20:24:24.09	2	8	4	2	t
c90e936d-3c8f-4bdb-a1b3-143b0cc6630e	Lightweight Travel Jacket	A lightweight jacket ideal for travel and outdoor activities.	79.99	35	2024-08-21 20:24:35.038	2	7	2	2	t
15d596af-2f59-49ac-b31b-cbefe121ebc0	Elegant Cocktail Dress	An elegant cocktail dress perfect for evening events.	139.99	15	2024-08-21 20:24:43.246	5	6	3	1	t
df717f7c-251a-4bd6-ab16-ebf00cfb3c23	Cozy Fleece Jacket	A soft fleece jacket ideal for keeping warm during chilly days.	89.99	30	2024-08-21 20:24:51.76	2	15	4	1	t
dcc69f2e-8107-48c8-9e51-e17c8a351719	Sleek Leather Wallet	A sleek and stylish wallet made from premium leather.	39.99	40	2024-08-21 20:25:00.256	6	14	1	2	t
ed71257a-972d-4445-a2da-bc49783a1c50	Summer Floral Dress	A breezy floral dress perfect for sunny days.	74.99	20	2024-08-21 20:25:09.124	5	13	2	1	t
910065e3-91b1-4d02-a9d4-d65528ffabbe	Casual Graphic Tee	A fun graphic tee for relaxed, everyday wear.	29.99	45	2024-08-21 20:25:50.94	3	12	2	2	t
d4dcd5f2-9e4c-496c-8bb4-50592dced40d	Trendy High-Waisted Skirt	A fashionable high-waisted skirt perfect for stylish ensembles.	54.99	30	2024-08-21 20:26:00.359	5	11	3	1	t
dadfd34b-7761-42ff-b407-cd49b2f3f78f	Chic Leather Boots	Elegant leather boots that complement both casual and formal outfits.	119.99	25	2024-08-21 20:26:09.528	4	10	4	2	t
87c10056-0a9b-4bc0-83e7-89366829557d	Luxurious Silk Scarf	A silky scarf to add a touch of luxury to any outfit.	34.99	60	2024-08-21 20:26:19.097	6	9	1	1	t
96e60405-fd9e-479a-a0bb-09295a6b449c	Classic White Button-Down	A timeless button-down shirt for a polished look.	49.99	40	2024-08-21 20:26:28.646	1	8	3	2	t
54da52ee-8903-4c14-8a6d-86a000ae9520	Urban Denim Jeans	Stylish jeans with a modern fit and durable fabric.	69.99	35	2024-08-21 20:26:40.086	3	7	2	2	t
a4aca9cb-185a-40f0-90dc-b7a61b29a411	Cozy Knit Sweater	A warm sweater for chilly weather and cozy evenings.	59.99	25	2024-08-21 20:26:47.325	6	2	4	1	t
b17634c4-f17a-4f78-a0b2-461bd8456116	Performance Running Shoes	High-performance shoes for running and athletic activities.	89.99	40	2024-08-21 20:26:57.414	4	5	3	2	t
2837ce10-fbd5-4261-9025-7af9d6142a2a	Professional Business Suit	A sophisticated suit for business meetings and professional settings.	199.99	15	2024-08-21 20:27:07.976	1	4	5	2	t
d6d6c2bc-b013-4feb-aee2-3b5e11b32b70	Summer Breeze Shorts	Comfortable shorts for hot summer days.	39.99	50	2024-08-21 20:27:17.713	3	1	2	2	t
a6d14c7c-ab07-49a9-925a-961e439db995	Elegant Evening Gown	An elegant dress for formal events and special occasions.	129.99	20	2024-08-21 20:27:28.002	5	6	3	1	t
db7b8562-9069-47d3-be8b-9e96d1b700de	Stylish Casual Jacket	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:27:37.021	2	3	4	2	t
fd30b6b9-4531-465a-95b8-cf51a5e90c67	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:34:19.377	3	1	2	1	t
9f68db76-e2ea-4fcd-bb0b-514c93d517e3	Elegant Winter Dress2	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-28 19:18:34.703	3	1	2	1	t
4eee4b11-a04f-419e-af7e-a3b7478328c0	Elegant Winter Dress3	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-28 21:01:46.854	3	1	2	1	t
fa820373-7028-4c31-93e2-40751265ed1d	Elegant Winter Dress4	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-29 19:48:03.917	3	1	2	1	t
80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f
\.


--
-- Data for Name: products_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_audit (id, product_id, name, description, price, stock, created_at, category_id, color_id, size_id, gender_id, active, operation_type, changed_at, changed_by) FROM stdin;
6	65647532-29db-42c3-9b03-4fdf6891784f	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:15:27.454	3	1	2	1	t	INSERT	2024-08-26 17:15:27.457238	\N
7	65647532-29db-42c3-9b03-4fdf6891784f	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:15:27.454	3	1	2	1	t	DELETE	2024-08-26 17:15:52.446401	\N
8	3b76ddad-dc35-4963-afa3-1fafe40e7043	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:16:19.979	3	1	2	1	t	INSERT	2024-08-26 17:16:19.982464	\N
9	3b76ddad-dc35-4963-afa3-1fafe40e7043	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:16:19.979	3	1	2	1	t	DELETE	2024-08-26 17:17:47.419375	\N
10	faae7a06-13a7-444e-af1a-92ae338a5723	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:18:19.48	3	1	2	1	t	INSERT	2024-08-26 17:18:19.483036	\N
11	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket M	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-26 17:26:33.471242	\N
12	59e125d6-cf71-4806-935c-0ae22f029f09	Elegant Summer Dress	A lightweight dress perfect for warm summer days.	59.99	50	2024-08-23 17:50:34.15	3	1	2	1	t	DELETE	2024-08-26 17:32:46.641872	\N
13	faae7a06-13a7-444e-af1a-92ae338a5723	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:18:19.48	3	1	2	1	t	DELETE	2024-08-26 17:33:44.050117	\N
14	fd30b6b9-4531-465a-95b8-cf51a5e90c67	Elegant Winter Dress	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-26 17:34:19.377	3	1	2	1	t	INSERT	2024-08-26 17:34:19.377272	\N
15	9f68db76-e2ea-4fcd-bb0b-514c93d517e3	Elegant Winter Dress2	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-28 19:18:34.703	3	1	2	1	t	INSERT	2024-08-28 19:18:34.716346	\N
16	4eee4b11-a04f-419e-af7e-a3b7478328c0	Elegant Winter Dress3	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-28 21:01:46.854	3	1	2	1	t	INSERT	2024-08-28 21:01:46.857134	\N
17	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket M	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 21:02:12.866831	\N
18	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket M	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:13:28.672631	\N
19	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket M	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:13:49.608324	\N
20	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:14:12.408631	\N
21	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:14:56.755552	\N
22	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:15:51.219683	\N
23	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:16:30.534209	\N
24	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:17:26.213078	\N
25	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket S	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	4	3	4	2	f	UPDATE	2024-08-28 23:18:06.473921	\N
26	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-28 23:18:14.178183	\N
27	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-29 01:03:47.856827	\N
28	fa820373-7028-4c31-93e2-40751265ed1d	Elegant Winter Dress4	A lightweight dress perfect for warm Winter days.	59.99	50	2024-08-29 19:48:03.917	3	1	2	1	t	INSERT	2024-08-29 19:48:03.920192	\N
29	80fb1fd0-8eb0-48c5-b893-973b991e331b	Stylish Casual Jacket	A versatile jacket perfect for casual outings and cool weather.	89.99	30	2024-08-21 20:14:21.423	2	3	4	2	f	UPDATE	2024-08-29 21:57:15.357583	\N
\.


--
-- Data for Name: sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sizes (size_id, name) FROM stdin;
1	S
2	M
3	L
4	XL
5	XXL
6	XS
\.


--
-- Data for Name: ticket_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_status (id, status) FROM stdin;
1	Pending
2	In Progress
3	Resolved
4	Cancelled
\.


--
-- Data for Name: ticket_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_types (id, type_name) FROM stdin;
1	reset_password
2	order_issue
3	product_problem
4	account_issue
5	refund_request
6	general_inquiry
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (id, user_id, type_id, user_name, user_email, user_phone_number, description, solution, analist_name, analist_email, status_id, created_at, updated_at) FROM stdin;
7b273510-6651-4a6a-a5d6-0fa63a72e0b4	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1	Clhoe Smiwh	chloe.smith@example.ca	+1-416-123-4567	I can't access my account	\N	\N	\N	1	2024-08-23 16:09:10.207654	2024-08-23 16:09:10.207654
6da44bb3-e881-489e-8b25-e70cee9049d9	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	2	Clhoe Smiwh	chloe.smith@example.ca	+1-416-123-4567	I can't access my account	The issue has been resolved by updating the configuration.	Edson	edson.exe@outlook.com	3	2024-08-23 14:35:19.965958	2024-08-23 16:23:43.122607
9e9dfe7d-e952-4c03-bf6f-2b84765ecc2e	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1	Clhoe Smiwh	chloe.smith@example.ca	+1-416-123-4567	I can't access my account	\N	\N	\N	1	2024-08-28 21:12:53.959771	2024-08-28 21:12:53.959771
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, personal_id, entity_type, name, gender, email, password, role, created_at, birthdate, address, number, neighborhood, city, country, active, last_login) FROM stdin;
8603cc1b-d667-4f4f-a5ec-989c403e560f	2218345067	BUSINESS	Sophia Martinez	2	sophia.martinez@business.com	$2a$12$8qm.h9n5LTscG80hdXU2m.ZC16geiWkdHJGBLDFcxyc4gvFiSg9Rm	ADMIN	2024-08-21 20:36:30.917	1985-03-12	456 Business Avenue	102	Downtown	Madrid	Spain	t	\N
26315a23-2db7-4969-8f76-b975a5bcc5b6	4412789654	BUSINESS	Hannah Kim	2	hannah.kim@company.co.kr	$2a$12$bueykia0ZtAWCYT6pPq1eu0EkKlJw3.xjp.f6glzt3880sRzefltO	CLIENT	2024-08-21 20:36:53.972	1980-11-30	101 Seoul Road	75	Gangnam	Seoul	South Korea	t	\N
e82fbc9a-fe2b-4378-a4cf-2bc719b6ae04	6698123456	BUSINESS	Emma Brown	2	emma.brown@business.co.uk	$2a$12$YAOLNByEbhxRGh9cuoqQQOUIa6vzMEWMOHoByahJBdeiGTy1xQz/2	CLIENT	2024-08-21 20:37:22.577	1987-09-09	303 London Road	210	West End	London	UK	t	\N
64cdd6b7-13b5-423c-8aa4-c435853cfe86	8823456789	BUSINESS	Yuki Nakamura	2	yuki.nakamura@company.jp	$2a$12$mp49CyYHuYQCTCSXOHOWDO./k42eOe7GY8VO97rZLktZR0FzZoKt6	CLIENT	2024-08-21 20:37:48.443	1988-06-14	505 Tokyo Tower	88	Shibuya	Tokyo	Japan	t	\N
8361d8ed-c05e-4158-ac72-d49b79f452bd	1045678901	BUSINESS	Anna Johansson	2	anna.johansson@company.se	$2a$12$UC8dGb9Usx9GYDQ2sCKw.u6jgT3Cz1qNSFfegHnJ8EQHyI993LvBa	ADMIN	2024-08-21 20:38:08.037	1978-08-22	707 Stockholm Street	12	Norrmalm	Stockholm	Sweden	t	\N
f0ce9152-0166-467d-9f79-8aee7a6e770f	1156789012	PERSONAL	Aisha Ahmed	2	aisha.ahmed@example.sa	$2a$12$6vXWqGi6tY6.dqwfcrRn..Yg6Nhz4hTMZkMfeHdaM8qawCBOrPACu	CLIENT	2024-08-21 20:38:19.333	1991-11-11	808 Riyadh Road	9	Al Olaya	Riyadh	Saudi Arabia	t	\N
c3d4dea2-6d46-45e4-9a1a-db2d1e8981fc	3327598471	PERSONAL	Liam O'Connor	1	liam.oconnor@example.ie	$2a$12$y/.y2i/XcJQ5bn5iyStUSuMxhoAtpObHcwfJxrII/JQqdcyLuqDzm	CLIENT	2024-08-21 20:36:43.67	1992-07-23	789 Green Lane	40	City Centre	Dublin	Ireland	t	\N
cdc56bc7-7e4d-42cf-82ec-e2b936e3ef7b	5567891230	PERSONAL	Jorge Silva	1	jorge.silva@example.br	$2a$12$duc3ncsugEMRrYdXUo7wo.HbnPfgHLO8bWeGMU.qCgxXFMLOMpSmm	CLIENT	2024-08-21 20:37:07.715	1995-05-15	202 Rio Street	14	Copacabana	Rio de Janeiro	Brazil	t	\N
99c55bdc-9e39-4e47-922a-362aa48bdb34	7712345678	PERSONAL	Omar Ali	1	omar.ali@example.ae	$2a$12$JD4xnlBol3hri8bplCdqje7mIXVZspr5/DIzYDJByo5Hw0nHNcOa6	CLIENT	2024-08-21 20:37:35.668	1990-02-28	404 Dubai Boulevard	35	Downtown	Dubai	UAE	t	\N
b212fcc1-c5ee-4764-b1a0-ffa349daed18	9923456780	PERSONAL	Carlos Fernández	1	carlos.fernandez@example.mx	$2a$12$BtpYmQGFFiWwipS8c2JxVubowuup0TTpm6O0Fq9trJJ5YdVCwzXyu	CLIENT	2024-08-21 20:37:58.644	1994-12-07	606 Mexico City Avenue	50	Centro Histórico	Mexico City	Mexico	t	\N
603a9774-2bc3-48c6-8454-78f03b75a4e5	1267890123	BUSINESS	Lucas Müller	1	lucas.muller@company.de	$2a$12$N/xGQY3ySaF8rkCSXaRYTuzA/QH7AIwrZMq0F6Q708etwjn9eNK/e	CLIENT	2024-08-21 20:38:34.853	1984-10-10	909 Berlin Avenue	23	Mitte	Berlin	Germany	t	\N
1aa7b223-8843-4efc-9007-c0eb5763f7ff	1378901234	PERSONAL	Chloe Smith	2	chloe.smith@example.ca	$2a$12$lmJW7gMLAToKBPRFY6y/AO1DynsXk7enxo7ryAeiGXRCT4rmhn2ni	CLIENT	2024-08-21 20:38:47.161	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	2024-08-23 12:10:50.171
8fd08ce9-22de-4f21-8042-889da3820866	45032219845	PERSONAL	Jakub Kowalski	1	jakub.kowalski@example.pl	$2a$12$JvpNGAQRjSHHgQa9vyVPdeRK7BHKGvjQU7.gI9vWNOgQrfDHFaQDa	CLIENT	2024-08-29 17:47:20.307	1990-07-22	123 Ulica Warszawska	15	Śródmieście	Warsaw	Poland	t	\N
8fceaae0-b3c7-4ce7-9318-20037194c05b	31010119890	PERSONAL	Li Wei	1	li.wei@example.cn	$2a$12$AIRIjxx2f2xvIzchTfWxrOUgjQ0EttXuPqs0Q.0a5slZjIyr9F0Ae	CLIENT	2024-08-28 21:21:13.476	1990-07-22	123 Beijing Road	15	Chaoyang	Beijing	China	t	2024-08-29 17:52:38.488
d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909
\.


--
-- Data for Name: users_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_audit (id, user_id, personal_id, entity_type, name, gender, email, password, role, created_at, birthdate, address, number, neighborhood, city, country, active, last_login, operation_type, changed_at, changed_by) FROM stdin;
6	c155abc4-1fa7-44e1-a531-eab91332d9ac	13789012346	PERSONAL	Chloe Smith	2	chloe.smith@example.ci	$2a$12$ZFGe2CgByphe5B9axYJgaeARwuLYsthhgW7cU6Z5Gtk0V/KyzCZ..	CLIENT	2024-08-26 18:56:20.427	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	\N	INSERT	2024-08-26 18:56:20.429222	\N
7	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	PERSONAL	Edson Aurélio de Oliveira Araújo	1	edson.exe@outlook.com	$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-26 20:08:07.918043	\N
8	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	PERSONAL	Edson Aurélio de Oliveira Araújo	1	edson.exe@outlook.com	$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-26 20:08:22.833767	\N
9	c155abc4-1fa7-44e1-a531-eab91332d9ac	13789012346	PERSONAL	Chloe Smith	2	chloe.smith@example.ci	$2a$12$ZFGe2CgByphe5B9axYJgaeARwuLYsthhgW7cU6Z5Gtk0V/KyzCZ..	CLIENT	2024-08-26 18:56:20.427	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	\N	DELETE	2024-08-27 15:31:00.095066	\N
10	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	PERSONAL	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com.br	$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-27 21:39:03.51436	\N
11	1aa7b223-8843-4efc-9007-c0eb5763f7ff	1378901234	PERSONAL	Chloe Smith	2	chloe.smith@example.ca	$2a$12$z3VHB/bUIj4iG8a5DtoB3.NQbnFF/2fOpFbkMfqF83lvRhW2IJf3m	CLIENT	2024-08-21 20:38:47.161	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	2024-08-23 12:10:50.171	UPDATE	2024-08-27 21:41:00.574394	\N
12	1aa7b223-8843-4efc-9007-c0eb5763f7ff	1378901234	PERSONAL	Chloe Smith	2	chloe.smith@example.ca	$2a$12$q9EOR2/IAmkzXDWDHCtbiuMbpsU8A6ePvaiWsvsDhWmYBUpuW68Xi	CLIENT	2024-08-21 20:38:47.161	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	2024-08-23 12:10:50.171	UPDATE	2024-08-27 21:41:22.069536	\N
13	8fceaae0-b3c7-4ce7-9318-20037194c05b	31010119890	PERSONAL	Li Wei	1	li.wei@example.cn	$2a$12$AIRIjxx2f2xvIzchTfWxrOUgjQ0EttXuPqs0Q.0a5slZjIyr9F0Ae	CLIENT	2024-08-28 21:21:13.476	1990-07-22	123 Beijing Road	15	Chaoyang	Beijing	China	t	\N	INSERT	2024-08-28 21:21:13.479018	\N
14	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	PERSONAL	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-28 21:23:13.931596	\N
15	1aa7b223-8843-4efc-9007-c0eb5763f7ff	1378901234	PERSONAL	Chloe Smith	2	chloe.smith@example.ca	$2a$12$G5V/EI9hvIF68jFUfuBSYObECVyRMWS/mK9X8Xu9.eVFGKVtBXvim	CLIENT	2024-08-21 20:38:47.161	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	2024-08-23 12:10:50.171	UPDATE	2024-08-29 00:53:20.160649	\N
16	8fceaae0-b3c7-4ce7-9318-20037194c05b	31010119890	PERSONAL	Li Wei	1	li.wei@example.cn	$2a$12$AIRIjxx2f2xvIzchTfWxrOUgjQ0EttXuPqs0Q.0a5slZjIyr9F0Ae	CLIENT	2024-08-28 21:21:13.476	1990-07-22	123 Beijing Road	15	Chaoyang	Beijing	China	t	\N	UPDATE	2024-08-29 00:54:49.770523	\N
17	1aa7b223-8843-4efc-9007-c0eb5763f7ff	1378901234	PERSONAL	Chloe Smith	2	chloe.smith@example.ca	$2a$12$sztGwnaINxCsB05NR14vIONcvraWi1jK2B4fKQDkwdHjku0yGgJvu	CLIENT	2024-08-21 20:38:47.161	1996-04-18	101 Toronto Street	3	Downtown	Toronto	Canada	t	2024-08-23 12:10:50.171	UPDATE	2024-08-29 00:55:10.654629	\N
18	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-29 00:56:37.449379	\N
19	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-22 21:55:13.28	UPDATE	2024-08-29 00:56:51.916588	\N
20	8fceaae0-b3c7-4ce7-9318-20037194c05b	31010119890	PERSONAL	Li Wei	1	li.wei@example.cn	$2a$12$AIRIjxx2f2xvIzchTfWxrOUgjQ0EttXuPqs0Q.0a5slZjIyr9F0Ae	CLIENT	2024-08-28 21:21:13.476	1990-07-22	123 Beijing Road	15	Chaoyang	Beijing	China	t	2024-08-29 00:54:49.769	UPDATE	2024-08-29 00:58:35.765344	\N
21	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 01:01:33.548955	\N
22	8fd08ce9-22de-4f21-8042-889da3820866	45032219845	PERSONAL	Jakub Kowalski	1	jakub.kowalski@example.pl	$2a$12$JvpNGAQRjSHHgQa9vyVPdeRK7BHKGvjQU7.gI9vWNOgQrfDHFaQDa	CLIENT	2024-08-29 17:47:20.307	1990-07-22	123 Ulica Warszawska	15	Śródmieście	Warsaw	Poland	t	\N	INSERT	2024-08-29 17:47:20.312776	\N
23	8fceaae0-b3c7-4ce7-9318-20037194c05b	31010119890	PERSONAL	Li Wei	1	li.wei@example.cn	$2a$12$AIRIjxx2f2xvIzchTfWxrOUgjQ0EttXuPqs0Q.0a5slZjIyr9F0Ae	CLIENT	2024-08-28 21:21:13.476	1990-07-22	123 Beijing Road	15	Chaoyang	Beijing	China	t	2024-08-29 00:58:35.763	UPDATE	2024-08-29 17:52:38.492234	\N
24	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:22:45.135153	\N
25	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	f	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:31:37.073357	\N
26	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:44:19.164776	\N
27	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:48:31.901749	\N
28	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:51:07.383293	\N
29	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	2	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:51:12.839463	\N
30	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:51:53.481537	\N
31	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:52:01.998705	\N
32	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	2	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:52:07.938727	\N
33	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	1	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:52:12.866424	\N
34	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	1317599578	BUSINESS	Edson Aurélio de Oliveira Araujo	2	edson.exe@outlook.com	$2a$12$46e2TnFH3KLWwo6Ebk/FU.0dUxZ8KYlZiq3FUb.m9zOli5Z.bojeu	ADMIN	2024-08-21 20:13:02.653	2000-01-01	123 Tech Street	500	Tech Hub	San Francisco	USA	t	2024-08-29 00:56:51.909	UPDATE	2024-08-29 18:52:40.366631	\N
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist_items (wishlist_id, product_id) FROM stdin;
56726c78-9276-466a-b90e-f982f600385d	63e10790-91aa-4189-9162-bd63682b560f
56726c78-9276-466a-b90e-f982f600385d	dcc69f2e-8107-48c8-9e51-e17c8a351719
56726c78-9276-466a-b90e-f982f600385d	dadfd34b-7761-42ff-b407-cd49b2f3f78f
56726c78-9276-466a-b90e-f982f600385d	d4dcd5f2-9e4c-496c-8bb4-50592dced40d
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (wishlist_id, user_id, created_at) FROM stdin;
56726c78-9276-466a-b90e-f982f600385d	d1c5b5e7-ab95-4f48-b8de-c89de4eea640	2024-08-22 17:17:43.693
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 21, true);


--
-- Name: colors_color_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colors_color_id_seq', 20, true);


--
-- Name: genders_gender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genders_gender_id_seq', 4, true);


--
-- Name: order_status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_status_id_seq', 5, true);


--
-- Name: phones_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phones_audit_id_seq', 8, true);


--
-- Name: products_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_audit_id_seq', 29, true);


--
-- Name: sizes_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sizes_size_id_seq', 6, true);


--
-- Name: ticket_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_status_id_seq', 4, true);


--
-- Name: ticket_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_types_id_seq', 6, true);


--
-- Name: users_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_audit_id_seq', 34, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: colors colors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_pkey PRIMARY KEY (color_id);


--
-- Name: genders genders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (gender_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (status_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: phones_audit phones_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones_audit
    ADD CONSTRAINT phones_audit_pkey PRIMARY KEY (id);


--
-- Name: phones phones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_pkey PRIMARY KEY (phone_id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products_audit products_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit
    ADD CONSTRAINT products_audit_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sizes sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (size_id);


--
-- Name: ticket_status ticket_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status
    ADD CONSTRAINT ticket_status_pkey PRIMARY KEY (id);


--
-- Name: ticket_status ticket_status_status_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_status
    ADD CONSTRAINT ticket_status_status_key UNIQUE (status);


--
-- Name: ticket_types ticket_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT ticket_types_pkey PRIMARY KEY (id);


--
-- Name: ticket_types ticket_types_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT ticket_types_type_name_key UNIQUE (type_name);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: users_audit users_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_audit
    ADD CONSTRAINT users_audit_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_personal_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_personal_id_key UNIQUE (personal_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (wishlist_id, product_id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (wishlist_id);


--
-- Name: phones phone_delete_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER phone_delete_trigger AFTER DELETE ON public.phones FOR EACH ROW EXECUTE FUNCTION public.audit_phone_delete();


--
-- Name: phones phone_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER phone_insert_trigger AFTER INSERT ON public.phones FOR EACH ROW EXECUTE FUNCTION public.audit_phone_insert();


--
-- Name: phones phone_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER phone_update_trigger AFTER UPDATE ON public.phones FOR EACH ROW EXECUTE FUNCTION public.audit_phone_update();


--
-- Name: products product_delete_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER product_delete_trigger AFTER DELETE ON public.products FOR EACH ROW EXECUTE FUNCTION public.audit_product_delete();


--
-- Name: products product_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER product_insert_trigger AFTER INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.audit_product_insert();


--
-- Name: products product_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER product_update_trigger AFTER UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.audit_product_update();


--
-- Name: users user_delete_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_delete_trigger AFTER DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_user_delete();


--
-- Name: users user_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_insert_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_user_insert();


--
-- Name: users user_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_update_trigger AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_user_update();


--
-- Name: users fk_gender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_gender FOREIGN KEY (gender) REFERENCES public.genders(gender_id);


--
-- Name: tickets fk_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES public.ticket_status(id) ON DELETE SET NULL;


--
-- Name: tickets fk_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES public.ticket_types(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_status(status_id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: phones_audit phones_audit_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones_audit
    ADD CONSTRAINT phones_audit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: phones phones_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products_audit products_audit_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit
    ADD CONSTRAINT products_audit_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: products_audit products_audit_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit
    ADD CONSTRAINT products_audit_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(color_id);


--
-- Name: products_audit products_audit_gender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit
    ADD CONSTRAINT products_audit_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(gender_id);


--
-- Name: products_audit products_audit_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_audit
    ADD CONSTRAINT products_audit_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(size_id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: products products_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(color_id);


--
-- Name: products products_gender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(gender_id);


--
-- Name: products products_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(size_id);


--
-- Name: wishlist_items wishlist_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(wishlist_id);


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

