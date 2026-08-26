// ===============================
// سیستم عضویت سایت نام‌آوران جنوب
// ===============================


// عناصر صفحه
const memberModal = document.getElementById("memberModal");

const firstNameInput = document.getElementById("firstName");

const lastNameInput = document.getElementById("lastName");

const registerButton = document.getElementById("registerMember");

const memberMessage = document.getElementById("memberMessage");

const membersList = document.getElementById("membersList");


// بررسی اینکه کاربر قبلاً عضو شده یا نه
const savedMember = localStorage.getItem("clubSiteMember");

if (savedMember) {
    memberModal.classList.add("hidden");
}


// ثبت عضویت
registerButton.addEventListener("click", async function () {

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();


    // نام و نام خانوادگی اجباری هستند
    if (!firstName && !lastName) {

        memberMessage.textContent =
            "برای ورود به سایت باید نام و نام خانوادگی خود را وارد کنید.";

        return;
    }


    if (!firstName) {

        memberMessage.textContent =
            "لطفاً نام خود را وارد کنید.";

        firstNameInput.focus();

        return;
    }


    if (!lastName) {

        memberMessage.textContent =
            "لطفاً نام خانوادگی خود را وارد کنید.";

        lastNameInput.focus();

        return;
    }


    memberMessage.textContent = "";

    registerButton.disabled = true;

    registerButton.textContent = "در حال ثبت عضویت...";


    try {

        // ثبت عضو در Supabase
        const { data, error } = await supabaseClient
            .from("club_members")
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName
                }
            ])
            .select();


        if (error) {

            console.error(error);

            memberMessage.textContent =
                "خطا در ثبت عضویت: " + error.message;

            registerButton.disabled = false;

            registerButton.textContent =
                "ثبت عضویت و ورود به سایت";

            return;
        }


        // ذخیره در مرورگر
        localStorage.setItem(
            "clubSiteMember",
            JSON.stringify(data[0])
        );


        // ورود به سایت
        memberModal.classList.add("hidden");


        // به‌روزرسانی لیست اعضا
        loadMembers();


    } catch (error) {

        console.error(error);

        memberMessage.textContent =
            "خطایی در اتصال رخ داد. دوباره تلاش کنید.";

        registerButton.disabled = false;

        registerButton.textContent =
            "ثبت عضویت و ورود به سایت";

    }

});


// دریافت و نمایش اعضا
async function loadMembers() {

    try {

        const { data, error } = await supabaseClient
            .from("club_members")
            .select("first_name, last_name");


        if (error) {

            console.error(error);

            membersList.textContent =
                "خطا در دریافت اعضا.";

            return;
        }


        if (!data || data.length === 0) {

            membersList.textContent =
                "هنوز عضوی ثبت نشده است.";

            return;
        }


        membersList.innerHTML = "";


        data.forEach(function (member) {

            const memberCard =
                document.createElement("div");

            memberCard.className = "member-card";

            memberCard.textContent =
                "👤 " +
                member.first_name +
                " " +
                member.last_name;

            membersList.appendChild(memberCard);

        });


    } catch (error) {

        console.error(error);

        membersList.textContent =
            "خطا در اتصال به سرور.";

    }

}


// اجرای دریافت اعضا هنگام باز شدن سایت
loadMembers();