import {
  CSSResultGroup,
  LitElement,
  PropertyValues,
  css,
  html,
  nothing,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repository } from "../package.json";
import { SplineCardConfig } from "./spline-card-config";
import { Application } from "@splinetool/runtime";
import { debounce } from "./utils/debounce";

const windowWithCards = window as unknown as Window & {
  customCards: unknown[];
};
windowWithCards.customCards = windowWithCards.customCards || [];

windowWithCards.customCards.push({
  type: "spline-card",
  documentationURL: repository.url,
});

@customElement("spline-card")
export class SplineCard extends LitElement {
  @query("canvas") private _canvas?: HTMLCanvasElement;

  private _app?: Application;

  @property() public hass: any;

  @property({ type: Boolean }) public preview = false;

  @state() private _config?: SplineCardConfig;

  @state() private _loadedURL?: string;

  setConfig(config: SplineCardConfig): void {
    this._config = config;
  }

  public static async getStubConfig(_hass: any): Promise<SplineCardConfig> {
    return {
      type: `custom:spline-card`,
      items: [],
    };
  }

  _unloadScene() {
    if (this._app) {
      this._app.dispose();
      this._loadedURL = undefined;
    }
  }

  async _loadScene() {
    if (!this._canvas) {
      return;
    }
    if (!this._config?.url) {
      return;
    }
    if (!this._app) {
      this._app = new Application(this._canvas);
    }
    if (this._config.url !== this._loadedURL) {
      await this._app.load(this._config.url);
      this._loadedURL = this._config.url;
      this._syncStates();
    }
  }

  private _debounceLoadScene = debounce(() => {
    this._loadScene();
  }, 2000);

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unloadScene();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadScene();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("_config")) {
      if (this._config?.url !== this._loadedURL) {
        // If we are in preview mode, debounce the load
        if (this.preview) {
          this._debounceLoadScene();
        } else {
          this._loadScene();
        }
      }
    }

    if (_changedProperties.has("hass")) {
      this._syncStates();
    }
  }

  private _defaultIntensities = new Map<string, number | undefined>();

  _syncStates() {
    if (!this._config?.items) {
      return;
    }
    if (!this._app) {
      return;
    }
    this._config.items.forEach((item) => {
      const entity = this.hass.states[item.entity];
      if (!entity) {
        return;
      }
      const state = entity.state;
      const onStates = Array.isArray(item.state) ? item.state : [item.state];

      if (!onStates) {
        return;
      }

      const target = this._app!.findObjectByName(item.object_name);

      if (!target) {
        return;
      }

      const isOn = onStates.includes(state);

      if (target.visible === isOn) {
        return;
      }
      target.visible = onStates.includes(state);

      if (entity.attributes.brightness == null || !item.brightness_control) {
        return;
      }

      if (!this._defaultIntensities.has(target.uuid)) {
        this._defaultIntensities.set(target.uuid, target.intensity);
      }

      const defaultIntensity = this._defaultIntensities.get(target.uuid);
      if (!defaultIntensity) {
        return;
      }
      const intensity = (entity.attributes.brightness / 255) * defaultIntensity;
      if (target.intensity === intensity) {
        return;
      }
      target.intensity = intensity;
    });
  }

  protected render() {
    const isLoaded = Boolean(this._loadedURL);

    return html`
      <ha-card>
        ${!isLoaded
          ? html`<ha-circular-progress indeterminate></ha-circular-progress>`
          : nothing}
        <canvas
          style=${isLoaded ? "display: block;" : "display: none;"}
        ></canvas>
      </ha-card>
    `;
  }

  public getGridOptions() {
    return {
      rows: 6,
    };
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
  }
}
