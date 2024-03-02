/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const APPOINTMENT_TABLE = {
    name: "Appointment",
    fields: [
        {
            column_name: "id",
            data_type: "integer",
            character_maximum_length: null,
            column_default: `nextval('"Appointment_id_seq"'::regclass)`,
            is_nullable: "NO",
        },
        {
            column_name: "time",
            data_type: "timestamp without time zone",
            character_maximum_length: null,
            column_default: "CURRENT_TIMESTAMP",
            is_nullable: "NO",
        },
        {
            column_name: "proUsrName",
            data_type: "text",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "clientUsrName",
            data_type: "text",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
    ],
};
const VIDEO_TABLE = {
    name: "Video",
    fields: [
        {
            column_name: "apptId",
            data_type: "integer",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "time",
            data_type: "timestamp without time zone",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "awsRef",
            data_type: "text",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
    ],
};

const MESSAGE_TABLE = {
    name: "Message",
    fields: [
        {
            column_name: "id",
            data_type: "integer",
            character_maximum_length: null,
            column_default: `nextval('"Message_id_seq"'::regclass)`,
            is_nullable: "NO",
        },
        {
            column_name: "apptId",
            data_type: "integer",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "time",
            data_type: "timestamp without time zone",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "sender",
            data_type: "text",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
        {
            column_name: "message",
            data_type: "text",
            character_maximum_length: null,
            column_default: null,
            is_nullable: "NO",
        },
    ],
};

const tables = [APPOINTMENT_TABLE, VIDEO_TABLE, MESSAGE_TABLE];

module.exports = {
    APPOINTMENT_TABLE,
    VIDEO_TABLE,
    MESSAGE_TABLE,
    tables
};
