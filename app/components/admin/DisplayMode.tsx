import { useAdmin } from "@/lib/AdminContext";
import { useClient } from "@/lib/ClientContext";

export default function DisplayMode() {
    const { context, display } = useClient();
    const { sendAction } = useAdmin();

    if (!context) return <></>;

    const toggle = () => {
        sendAction("display", !display);
    };

    return (
        <div className="card card-body">
            <div className="d-flex justify-content-between">
                <h6>Display Mode</h6>
                <div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={display}
                            onInput={toggle}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
