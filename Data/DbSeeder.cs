using Masadir.Models;

namespace Masadir.Data;

public static class DbSeeder
{
    public static void Seed(MasadirContext db)
    {
        db.Database.EnsureCreated();

        if (db.Users.Any()) return; // already seeded

        var admin = new User
        {
            FullName = "عبدالله المشرف",
            Email = "admin@masadir.sa",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow.AddDays(-120)
        };
        var dev1 = new User
        {
            FullName = "سلطان الدوسري",
            Email = "dev1@masadir.sa",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Dev@12345"),
            Role = UserRole.Contributor,
            CreatedAt = DateTime.UtcNow.AddDays(-100)
        };
        var dev2 = new User
        {
            FullName = "نورة القحطاني",
            Email = "dev2@masadir.sa",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Dev@12345"),
            Role = UserRole.Contributor,
            CreatedAt = DateTime.UtcNow.AddDays(-90)
        };

        db.Users.AddRange(admin, dev1, dev2);
        db.SaveChanges();

        var projects = new List<Project>
        {
            new() { Title = "Zad - إدارة المهام", Description = "تطبيق ويب لإدارة المهام والمشاريع الشخصية، مبني بـ ASP.NET Core و SQL Server، يدعم الفرق والتذكيرات.", RepoUrl = "https://github.com/example/zad-tasks", Language = "C#", License = "MIT", Tags = "web,productivity,aspnetcore", OwnerId = dev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-80) },
            new() { Title = "Rasel - مكتبة رسائل SMS", Description = "مكتبة خفيفة بلغة JavaScript لإرسال رسائل SMS عبر مزودين متعددين بواجهة موحدة.", RepoUrl = "https://github.com/example/rasel-sms", Language = "JavaScript", License = "MIT", Tags = "sms,library,nodejs", OwnerId = dev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-75) },
            new() { Title = "Souq CLI", Description = "أداة سطر أوامر بلغة Python لمتابعة أسعار المنتجات في المتاجر الإلكترونية السعودية وإشعارك عند تغيّرها.", RepoUrl = "https://github.com/example/souq-cli", Language = "Python", License = "Apache-2.0", Tags = "cli,scraping,ecommerce", OwnerId = dev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-70) },
            new() { Title = "Hisn - إطار حماية API", Description = "إطار عمل بلغة C# لحماية واجهات REST API من هجمات Rate Limiting و Brute Force بسهولة.", RepoUrl = "https://github.com/example/hisn-security", Language = "C#", License = "GPL-3.0", Tags = "security,api,dotnet", OwnerId = dev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-65) },
            new() { Title = "Lughati - مدقق إملائي عربي", Description = "مكتبة PHP للتدقيق الإملائي والنحوي للنصوص العربية، تدعم التكامل مع لارافل.", RepoUrl = "https://github.com/example/lughati-php", Language = "PHP", License = "MIT", Tags = "nlp,arabic,laravel", OwnerId = dev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-60) },
            new() { Title = "Khuta - مولد خطوط عربية", Description = "أداة Python لتوليد وتحويل الخطوط العربية لاستخدامها في تطبيقات الويب والموبايل.", RepoUrl = "https://github.com/example/khuta-fonts", Language = "Python", License = "MIT", Tags = "fonts,design,arabic", OwnerId = dev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-55) },
            new() { Title = "Rakez - نظام حجز قاعات", Description = "نظام حجز قاعات ومرافق مفتوح المصدر مبني بـ ASP.NET Core MVC و Entity Framework.", RepoUrl = "https://github.com/example/rakez-booking", Language = "C#", License = "MIT", Tags = "booking,aspnetcore,mvc", OwnerId = admin.Id, CreatedAt = DateTime.UtcNow.AddDays(-50) },
            new() { Title = "Nabd - لوحة مراقبة السيرفرات", Description = "لوحة تحكم بلغة JavaScript و Node.js لمراقبة أداء السيرفرات في الوقت الحقيقي.", RepoUrl = "https://github.com/example/nabd-monitor", Language = "JavaScript", License = "Apache-2.0", Tags = "devops,monitoring,nodejs", OwnerId = dev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-45) },
            new() { Title = "Wasl - مكتبة تكامل دفع", Description = "مكتبة C# للتكامل السريع مع بوابات الدفع السعودية (مدى، STC Pay) في مشاريع .NET.", RepoUrl = "https://github.com/example/wasl-payments", Language = "C#", License = "MIT", Tags = "payments,dotnet,fintech", OwnerId = dev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-40) },
            new() { Title = "Tareq - محرك خرائط خفيف", Description = "مكتبة Python لحساب أقصر الطرق بين النقاط باستخدام خرائط OpenStreetMap.", RepoUrl = "https://github.com/example/tareq-routing", Language = "Python", License = "BSD-3-Clause", Tags = "maps,routing,gis", OwnerId = dev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-35) },
            new() { Title = "Safahat - منصة تدوين مصغرة", Description = "منصة تدوين خفيفة الوزن بلغة PHP بدون إطار عمل، تركّز على السرعة والبساطة.", RepoUrl = "https://github.com/example/safahat-blog", Language = "PHP", License = "MIT", Tags = "blog,cms,php", OwnerId = dev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-30) },
            new() { Title = "Qafilah - تتبع الشحنات", Description = "واجهة برمجية REST بلغة C# لتتبع الشحنات والطرود عبر شركات الشحن المحلية.", RepoUrl = "https://github.com/example/qafilah-tracking", Language = "C#", License = "MIT", Tags = "logistics,api,dotnet", OwnerId = admin.Id, CreatedAt = DateTime.UtcNow.AddDays(-20) },
        };

        db.Projects.AddRange(projects);
        db.SaveChanges();

        // Stars: distribute varied counts across users (only 3 users, so max 3 stars/project but we vary which projects get stars)
        var rnd = new Random(42);
        var allUsers = new[] { admin, dev1, dev2 };
        foreach (var p in projects)
        {
            // simulate varied star counts by adding multiple star rows is impossible with only 3 users due to unique constraint,
            // so vary via a deterministic subset per project for realistic sorting differences.
            var starCount = rnd.Next(0, 4);
            var shuffled = allUsers.OrderBy(_ => rnd.Next()).Take(starCount);
            foreach (var u in shuffled)
            {
                db.Stars.Add(new Star { ProjectId = p.Id, UserId = u.Id, CreatedAt = DateTime.UtcNow.AddDays(-rnd.Next(1, 30)) });
            }
        }
        db.SaveChanges();

        // extra weighting: force a few projects to have all 3 stars to show "most starred" sorting clearly
        foreach (var title in new[] { "Zad - إدارة المهام", "Hisn - إطار حماية API", "Wasl - مكتبة تكامل دفع" })
        {
            var proj = projects.First(p => p.Title == title);
            foreach (var u in allUsers)
            {
                if (!db.Stars.Any(s => s.ProjectId == proj.Id && s.UserId == u.Id))
                {
                    db.Stars.Add(new Star { ProjectId = proj.Id, UserId = u.Id, CreatedAt = DateTime.UtcNow.AddDays(-rnd.Next(1, 10)) });
                }
            }
        }
        db.SaveChanges();

        var comments = new List<Comment>
        {
            new() { ProjectId = projects[0].Id, UserId = dev2.Id, Body = "مشروع حلو وسهل الاستخدام، جربته مع فريقي وسهّل علينا تنظيم المهام.", CreatedAt = DateTime.UtcNow.AddDays(-10) },
            new() { ProjectId = projects[0].Id, UserId = admin.Id, Body = "ناقص دعم للإشعارات عبر الجوال، بس بشكل عام تجربة ممتازة.", CreatedAt = DateTime.UtcNow.AddDays(-8) },
            new() { ProjectId = projects[1].Id, UserId = dev1.Id, Body = "وفرت علي وقت كبير بدل ما أسوي integration لكل مزود لحاله.", CreatedAt = DateTime.UtcNow.AddDays(-20) },
            new() { ProjectId = projects[2].Id, UserId = dev2.Id, Body = "الأداة شغالة تمام، بس ياريت تضيفون دعم لمتاجر أكثر.", CreatedAt = DateTime.UtcNow.AddDays(-15) },
            new() { ProjectId = projects[3].Id, UserId = admin.Id, Body = "إطار قوي، استخدمناه في مشروع إنتاجي وثبت كفاءته ضد هجمات brute force.", CreatedAt = DateTime.UtcNow.AddDays(-5) },
            new() { ProjectId = projects[3].Id, UserId = dev2.Id, Body = "التوثيق واضح جداً، سهّل علينا التركيب في أقل من ساعة.", CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new() { ProjectId = projects[4].Id, UserId = dev1.Id, Body = "دقة التدقيق الإملائي جيدة لكن ياخذ وقت على نصوص طويلة.", CreatedAt = DateTime.UtcNow.AddDays(-12) },
            new() { ProjectId = projects[8].Id, UserId = dev1.Id, Body = "تكامل مباشر مع مدى وسهل بالفعل، شكراً على المجهود.", CreatedAt = DateTime.UtcNow.AddDays(-2) },
        };

        db.Comments.AddRange(comments);
        db.SaveChanges();
    }
}
