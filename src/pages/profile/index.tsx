import { Avatar, Tag, Typography } from "antd";
import { get } from "lodash";
import { Button, Panel } from "../../components";
import useHooks from "../../hooks/useHooks";
import { helpers, useStore } from "../../services";

const ProfilePage = () => {
  const { t, navigate } = useHooks();
  const { user, setLogout, language } = useStore();
  const profile = get(user, "data", {});
  const initials = `${get(profile, "first_name[0]", "")}${get(profile, "last_name[0]", "")}`.toUpperCase();

  return (
    <Panel title={t("Profil")} hasButton={false}>
      <div className="flex items-center gap-5">
        <Avatar size={72} src={get(profile, "avatar.src")} className="bg-blue-500 text-2xl">{initials}</Avatar>
        <div className="flex flex-col gap-1">
          <Typography.Title level={4} className="!m-0">{get(profile, "full_name")}</Typography.Title>
          <Typography.Text type="secondary">{helpers.formatInputPhoneNumber(get(profile, "phone_number", ""))}</Typography.Text>
          <div className="flex gap-1 flex-wrap">
            {get(profile, "roles", []).map((r: any) => <Tag key={r.id} color="blue">{get(r, `name_${language}`, r.name)}</Tag>)}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => navigate(`/users/update/${get(profile, "id")}`)}>{t("Tahrirlash")}</Button>
          <Button danger onClick={() => { setLogout(); navigate("/login"); }}>{t("Chiqish")}</Button>
        </div>
      </div>
    </Panel>
  );
};

export default ProfilePage;
