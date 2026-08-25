const DB = {
    async getSettings() {
        const { data, error } = await supabaseClient
            .from("site_settings")
            .select("*")
            .eq("id", 1)
            .single();

        if (error) {
            console.error("خطا در دریافت تنظیمات:", error);
            return null;
        }

        return data;
    },

    async saveSettings(settings) {
        const { error } = await supabaseClient
            .from("site_settings")
            .upsert({
                id: 1,
                data: settings
            });

        if (error) {
            console.error("خطا در ذخیره تنظیمات:", error);
            alert("خطا در ذخیره اطلاعات!");
            return false;
        }

        return true;
    }
};