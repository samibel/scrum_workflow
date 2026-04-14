# Domain Model Documentation

## Overview

<!-- Fill from documentarian analysis -->

**Total Entities Documented:** {{total_entities}}
**Core Entities:** {{core_entity_count}}
**Value Objects & Enums:** {{value_object_count}}
**Data Flow Structures:** {{dto_count}}
**Analysis Timestamp:** {{analysis_timestamp}}

Summary of domain entities, their relationships, and data structures discovered in the codebase. Entities are grouped by category and bounded context for navigation.

## Core Entities

Domain objects with business meaning. Each core entity represents a fundamental concept in the domain with attributes, behaviors, and relationships to other entities.

### {{entity_name}}

- **Description:** {{plain language explanation of what this entity represents}}
- **Location:** `[Source: path/to/file.ext:LINE]` (use LINE-N-N for ranges, comma-separate for multiple files, all paths relative from project root)
- **Key Attributes/Fields:** {{list of important attributes or fields}}
- **Relationships:** {{relationships to other entities: inheritance, composition, association}}

<!-- Fill from documentarian analysis -->

## Entity Relationships

Foreign keys, associations, inheritance hierarchies, and domain constraints that define how entities relate to each other.

### {{relationship_name}}

- **Type:** {{inheritance|composition|association|dependency}}
- **Description:** {{plain language explanation of this relationship}}
- **Location:** `[Source: path/to/file.ext:LINE]` (use LINE-N-N for ranges, comma-separate for multiple files, all paths relative from project root)
- **Entities Involved:** {{list of entities connected by this relationship}}
- **Cardinality:** {{one-to-one|one-to-many|many-to-many}} (if discoverable)

<!-- Fill from documentarian analysis -->

```mermaid
classDiagram
    class {{EntityA}} {
        +attribute1
        +attribute2
        +method1()
    }
    class {{EntityB}} {
        +attribute1
        +attribute2
    }
    {{EntityA}} --|> {{EntityB}} : inherits
    {{EntityA}} *-- {{EntityC}} : composition
```

## Value Objects & Enums

Immutable value types, enumerations, and domain constants that represent domain concepts without identity.

### {{value_object_name}}

- **Description:** {{what this value object or enum represents}}
- **Location:** `[Source: path/to/file.ext:LINE]` (use LINE-N-N for ranges, comma-separate for multiple files, all paths relative from project root)
- **Values/Members:** {{list of enum values or value object states}}
- **Business Context:** {{domain constraint or policy this value object enforces}}

<!-- Fill from documentarian analysis -->

## Data Flow Structures

Data transfer objects (DTOs), requests, responses, and payloads that move data between layers or across boundaries.

### {{dto_name}}

- **Description:** {{what this DTO is used for}}
- **Location:** `[Source: path/to/file.ext:LINE]` (use LINE-N-N for ranges, comma-separate for multiple files, all paths relative from project root)
- **Fields:** {{list of DTO fields}}
- **Usage Context:** {{where this DTO is used: API boundary, inter-service communication, etc.}}

<!-- Fill from documentarian analysis -->

## Database Schema

<!-- OPTIONAL SECTION: Only include this section if database schemas are detected (migrations, ORM entities, schema definitions). If no schemas detected, omit this entire section. -->

### Schema Overview

Database tables, columns, and foreign key relationships that persist the domain model.

### {{table_name}}

- **Description:** {{what this table stores}}
- **Location:** `[Source: path/to/file.ext:LINE]` (migration file or ORM model definition)
- **Columns:** {{list of columns with data types}}
- **Primary Key:** {{primary key column}}
- **Foreign Keys:** {{relationships to other tables}}

```mermaid
erDiagram
    {{TABLE_A}} ||--o{ {{TABLE_B}} : "foreign_key"
    {{TABLE_A}} {
        int id PK
        string column1
        datetime column2
    }
    {{TABLE_B}} {
        int id PK
        int table_a_id FK
        string column1
    }
```

<!-- Fill from documentarian analysis -->
