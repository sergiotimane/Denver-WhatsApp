import { SupabaseClientType } from "../_shared/supabase_types.ts";

export abstract class SetupCore {
    constructor(private supabase: SupabaseClientType, private setupName: string) {
    }
    async execute() {
        const response1 = await this.supabase
            .from('setup')
            .update({ in_progress: true })
            .eq('name', this.setupName)
        if (response1.error) throw response1.error
        try {
            await this.setup(this.supabase)
            const response2 = await this.supabase
                .from('setup')
                .update({ in_progress: false, done_at: new Date() })
                .eq('name', this.setupName)
            if (response2.error) throw response2.error
        } catch (e) {
            console.error(`Error in setup: ${this.setupName}`, e)
            const response2 = await this.supabase
                .from('setup')
                .update({ in_progress: false })
                .eq('name', this.setupName)
            if (response2.error) throw response2.error
            throw e
        }
    }
    abstract setup(supabase: SupabaseClientType): Promise<void>;
}
