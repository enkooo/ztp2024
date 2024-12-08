<script>

    export default {
        props: [ 'item' ],
        emits: [ 'close' ],
        data() {
            return {
                isValid: false,
                input: {},
                rules: {
                    notEmpty: value => {
                        const pattern = /^[\p{L}\p{N}]/u
                        return pattern.test(value) || `should start with a letter or a digit`
                    }
                }
            }
        },
        methods: {
            close(action) {
                this.$emit('close', action)
            }  
        },
        mounted() {
            if(!this.item.id) {
                this.item.name = ''
                this.item.serial = ''
            }
        }
    }
</script>

<template>
    <v-form v-model="isValid">
        <v-card>
            <v-card-title>{{ item.id ? 'Update' : 'Insert' }}</v-card-title>
            <v-card-subtitle v-if="item.id">
                Item id {{ item.id }}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field variant="outlined" label="Name" v-model="item.name" :rules="[ rules.notEmpty ]">
                </v-text-field>
                <v-text-field variant="outlined" label="S/N" v-model="item.serial" :rules="[ rules.notEmpty ]">
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="close('insert')" :disabled="!isValid" v-if="!item.id"><v-icon>mdi-table-plus</v-icon></v-btn>
                <v-btn color="primary" variant="elevated" @click="close('update')" :disabled="!isValid" v-if="item.id"><v-icon>mdi-table-edit</v-icon></v-btn>
                <v-btn color="error" variant="elevated" @click="close('delete')" v-if="item.id"><v-icon>mdi-table-remove</v-icon></v-btn>
                <v-btn variant="elevated" @click="close(null)"><v-icon>mdi-cancel</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<style scoped>
</style>