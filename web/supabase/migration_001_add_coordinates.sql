-- Migration 001: add coordinate + persona columns to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS home_lat          double precision;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS home_lng          double precision;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS work_lat          double precision;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS work_lng          double precision;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS interests         text;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS occupation_context text;
