-- Orders table for the in-app Stripe checkout MVP
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','cancelled')),

  -- Customer contact
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,

  -- Shipping address
  shipping_street text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_city text NOT NULL,

  -- Shipping method
  shipping_method text NOT NULL DEFAULT 'courier',
  shipping_method_label text NOT NULL DEFAULT 'Kurier',
  shipping_cost_grosze integer NOT NULL DEFAULT 1800,

  -- Cart snapshot: [{ seller_id, name, price_grosze, quantity, image }, ...]
  items jsonb NOT NULL,
  items_total_grosze integer NOT NULL,
  total_grosze integer NOT NULL,
  currency text NOT NULL DEFAULT 'PLN',

  -- Stripe
  stripe_session_id text,
  stripe_payment_intent_id text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE INDEX orders_stripe_session_id_idx ON public.orders(stripe_session_id);
CREATE INDEX orders_status_idx ON public.orders(status);

-- Grants: only service_role touches this table. Checkout flow runs via
-- server functions using the service-role client. No anon/authenticated access.
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Deny-by-default: no policies for anon/authenticated => no direct client access.
-- (service_role bypasses RLS.)

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();