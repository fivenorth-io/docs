# 5N Time Machine 

A Canton participant node doesn't preserve its history through a [hard domain migration](https://docs.dev.sync.global/validator_operator/validator_major_upgrades.html)

Secondly, to improve performance of participant we may enable pruning. When the pruning run, updates older than the threshold is deleted. This mean if someone want to rebuild the history they will not be able to go back to the first update.

5N Time Machine subscribes to your ledger, get all the update, save them into a postres data in a schema call `time_machine`

```
    Schema    |      Name      | Type  | Owner
--------------+----------------+-------+--------
 time_machine | events         | table | wallet
 time_machine | last_processed | table | wallet
 time_machine | updates        | table | wallet
```

With these tables your application can simply query data directly off these tables to fetch and process update, as well as go back and consume the update.

It handles HDM seamlessly and order the right stream happen on your node. You will have all the history, even for previous HDM, all localte in the same database with a migration_id field to separate them. Even when the migration_id change, you will still be able to consume the `updates` table order by the `id` field and gurantee to have them happen in the exact order as them happen on ledger across migration.

## Use case

- You want to be able to preseve all ledger data but also want to enable prune at the same time
- You are building ETL data on top of ledger data. If you had a bug, you can easily rebuild data with SQL queyr alone.
- You want to have multiple worker consume ledger data, but do not want to slow it down. Now you just need to let time machine does it job and simply tail this `updates` table
- You can use LISTEN/NOTIFY to monitor transactions of users of this `updates` table.

## Features

- Populate your postgres data with all the update in your ledger node
- Manage users and parties.
- Interactive Shell Execution/History
- Backup identities dump

## Schemas

### Updates tabel
```
                             Table "time_machine.updates"
          Column           |           Type           | Collation | Nullable | Default
---------------------------+--------------------------+-----------+----------+---------
 id                        | bigint                   |           | not null |
 update_id                 | character varying(255)   |           | not null |
 command_id                | character varying(255)   |           | not null |
 effective_at              | timestamp with time zone |           | not null |
 record_time               | timestamp with time zone |           | not null |
 offset                    | bigint                   |           | not null |
 migration_id              | integer                  |           | not null |
 external_transaction_hash | character varying        |           | not null |
```

### Event table

```
                                Table "time_machine.events"
   Column   |       Type        | Collation | Nullable |              Default
------------+-------------------+-----------+----------+------------------------------------
 id         | integer           |           | not null | nextval('events_id_seq'::regclass)
 update_id  | bigint            |           | not null |
 key        | character varying |           | not null |
 event_json | jsonb             |           |          | '{}'::jsonb
```

## Upcoming 

- Populate ACS
- Provide relevent endpoint that is compatible with ledger so you can just point to Time Machine to fetch ACS in a more efficient way

## Demo Videos

TBD
