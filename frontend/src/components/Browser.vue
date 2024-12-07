<script>

const api = '/api/merchants'

export default {
    data: () => ({
        itemsPerPage: 5,
        headers: [
            { title: 'NIP', key: 'nip', align: 'start', sortable: true },
            { title: 'Company', key: 'company', align: 'start', sortable: true },
            { title: 'Address', key: 'address', align: 'start' },
            { title: 'Phone', key: 'phone', align: 'end' },
            { title: 'Email', key: 'email', align: 'start' },
            { title: 'Registered', key: 'registration', align: 'end' }
        ],
        serverItems: [],
        loading: true,
        totalItems: 0,
        search: ''
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
                body.data.forEach((element, index, arr) => {
                    arr[index].phone = element.phone.replace(/\s/g, '')
                    arr[index].registration = element.registration.substring(0, 10)
                });
                this.serverItems = body.data
                this.totalItems = body.total
                this.loading = false
            }))
        },
        clickItem(item, event) {
            alert(event.item.nip)
        }
    }
}
</script>

<template>
    <v-card variant="outlined">
        <v-card-title>Data</v-card-title>
        <v-card-text>
            <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
                :items-length="totalItems" :loading="loading" :search="search"
                @update:options="loadItems" @click:row="clickItem">
                <template v-slot:tfoot>
                    <tr>
                        <td colspan="2">
                            <v-text-field v-model="search" class="ma-2" variant="outlined" density="compact" placeholder="search..."
                                hide-details></v-text-field>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
</template>

<style scoped>
</style>