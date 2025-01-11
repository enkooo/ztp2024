<script>

import Editor from './Editor.vue'

const api = '/api/goods'

export default {
    components: { Editor },
    emits: [ 'alert' ],
    data: () => ({
        itemsPerPage: 5,
        headers: [
            { title: 'Id', key: 'id', align: 'end', sortable: false },
            { title: 'Name', key: 'name', align: 'start', sortable: true },
            { title: 'S/N', key: 'serial', align: 'start', sortable: true }
        ],
        serverItems: [],
        loading: true,
        totalItems: 0,
        search: '',
        tableKey: 0,
        editor: false,
        item: {}
    }),
    methods: {
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            const offset = (page - 1) * itemsPerPage
            let queryString = { offset, limit: itemsPerPage, search: this.search }
            if(sortBy && sortBy[0]) {
                queryString.sort = sortBy[0].key
                queryString.order = sortBy[0].order
            }            
            fetch(api + '?' + 
              new URLSearchParams(queryString).toString())
            .then(res => res.json().then(body => {
                this.serverItems = body.data
                this.totalItems = body.total
                this.loading = false
            }))
        },
        clickItem(item, event) {
            Object.assign(this.item, event.item)
            this.editor = true
        },
        clickInsert() {
            Object.assign(this.item, {
                id: null,
                name: '',
                serial: ''
            })
            this.editor = true
        },
        editorClose(action) {
            this.editor = false
            switch(action) {

                case 'insert':
                fetch(api, {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(this.item)
                    }).then(res => {
                        res.json().then(data => {
                            if(!res.ok) {
                                this.$emit('alert', data.error, 'error')
                            } else {
                                this.tableKey++
                                this.$emit('alert', 'Inserted successfully')
                            }
                        }).catch(err => {
                            this.$emit('alert', 'Not inserted', 'error')
                        })
                    })
                    break

                case 'update':
                fetch(api, {
                    method: 'PUT',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(this.item)
                    }).then(res => {
                        res.json().then(data => {
                            if(!res.ok) {
                                this.$emit('alert', data.error, 'error')
                            } else {
                                this.tableKey++
                                this.$emit('alert', 'Updated successfully')
                            }
                        }).catch(err => {
                            this.$emit('alert', 'Not updated', 'error')
                        })
                    })
                    break

                case 'delete':
                fetch(api + '?' + new URLSearchParams({ id: this.item.id }).toString(), {
                    method: 'DELETE'
                    }).then(res => {
                        res.json().then(data => {
                            if(!res.ok) {
                                this.$emit('alert', data.error, 'error')
                            } else {
                                this.tableKey++
                                this.$emit('alert', 'Deleted successfully')
                            }
                        }).catch(err => {
                            this.$emit('alert', 'Not deleted', 'error')
                        })
                    })
                    break
            }
        }
    }
}
</script>

<template>
    <v-card>
        <v-card-title>Goods</v-card-title>
        <v-card-text>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
                :items-length="totalItems" :loading="loading" :search="search"
                @update:options="loadItems" @click:row="clickItem" :key="tableKey">
                <template #footer.prepend>
                    <v-btn class="mr-12" variant="elevated" @click="clickInsert"><v-icon>mdi-table-plus</v-icon></v-btn>
                    <v-text-field v-model="search" class="mr-5" variant="outlined" density="compact" placeholder="search..."
                        hide-details prepend-icon="mdi-magnify"></v-text-field>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>

    <v-dialog v-model="editor" width="50%" ref="editor">
        <Editor :item="item" @close="editorClose"/>
    </v-dialog>
</template>

<style scoped>
</style>